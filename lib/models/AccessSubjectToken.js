/* eslint-disable no-param-reassign */
import Sequelize, { DataTypes as DT, Op } from 'sequelize';
import _Flatten from 'lodash/flatten';
import _Uniq from 'lodash/uniq';
import sequelize     from '../sequelizeSingleton';
import Base          from './WorkspaceModelBase';
import AccessSubject from './AccessSubject';
import AccessSetting from './AccessSetting';
import AccessReadersGroup from './AccessReadersGroup';
import AccessTokenToReaderChangesMap from './AccessTokenToReaderChangesMap';
import { initLogger } from './../extensions/Logger';
import { ACTION_TYPES } from './../constants/accessTokenToReaderChangesMap.js';

const logger = initLogger('AccessSubjectToken');

class AccessSubjectToken extends Base {
    static TYPE_NFC = 'NFC'
    static TYPE_RFID = 'RFID'

    static initRelations() {
        super.initRelations();
        this.AssociationAccessSubject = this.belongsTo(AccessSubject, { as: 'accessSubject', foreignKey: 'accessSubjectId' });
    }

    async getAssociatedEntitiesData(options) {
        const accessSubject = await this.getAccessSubject({
            ...options,
            attributes : [ 'id' ],
            include    : [
                {
                    association : AccessSubject.AssociationAccessSettings,
                    attributes  : [ 'id' ],
                    required    : false,
                    include     : [
                        {
                            association : AccessSetting.AssociationAccessTokenReaders,
                            attributes  : [ 'id' ],
                            required    : false
                        },
                        {
                            association : AccessSetting.AssociationAccessReadersGroups,
                            include     : [ {
                                association : AccessReadersGroup.AssociationAccessTokenReaders,
                                attributes  : [ 'id' ],
                                required    : false
                            } ],
                            attributes : [ 'id' ],
                            required   : false
                        }
                    ]
                }
            ]
        });

        // nothing to update for sync
        if (!accessSubject) {
            return {
                accessTokenReaderIds    : [],
                accessSubjectTokenCodes : []
            };
        }

        const accessSettings = accessSubject.accessSettings;

        const accessTokenReaderIds = _Uniq([
            ..._Flatten(accessSettings.map(accessSetting => {
                return [
                    ...accessSetting.accessTokenReaders.map(({ id }) => id),
                    ..._Flatten(accessSetting.accessReadersGroups.map(({ accessTokenReaders }) => {
                        return accessTokenReaders.map(({ id }) => id);
                    }))
                ];
            }))
        ]);
        const accessSubjectTokenCodes = [ this.code ];

        return {
            accessTokenReaderIds,
            accessSubjectTokenCodes
        };
    }

    async updateReaderTokens(options, { actionType } = {}) {
        if (!this.accessSubjectId) {
            logger.info('[updateReaderTokens]: token is not attached to any subject');

            return;
        }

        const { accessTokenReaderIds, accessSubjectTokenCodes } = await this.getAssociatedEntitiesData(options);

        await AccessTokenToReaderChangesMap.addUpdates(
            {
                accessTokenReaderIds,
                accessSubjectTokenCodes,
                actionType
            },
            options
        );
    }

    static async findAllByParams({ ids, limit, offset, sortedBy, order, ...filters }, options = {}) {
        const filterScopes = [
            { method: [ 'ids', ids ] },
            { method: [ 'search', filters.search ] },
            { method: [ 'accessSubjectId', filters.accessSubjectId ] },
            { method: [ 'type', filters.type ] },
            { method: [ 'enabled', filters.enabled ] },
            { method: [ 'isArchived', filters.isArchived ] },
            { method : [ 'updateDates', {
                updateStart : filters.updateStart,
                updateEnd   : filters.updateEnd
            } ] },
            { method : [ 'createDates', {
                createStart : filters.createStart,
                createEnd   : filters.createEnd
            } ] }
        ];

        const { rows: accessSubjectTokens, count } = await AccessSubjectToken.scope(filterScopes).findAndCountAll({
            ...options,
            ...(ids) ? {} : { limit, offset },
            order    : [ [ sortedBy, order ], [ 'id', 'ASC' ] ],
            subQuery : false
        });

        return { accessSubjectTokens, count };
    }
}
AccessSubjectToken.init({
    id              : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
    // eslint-disable-next-line max-len
    workspaceId     : { type: DT.BIGINT, allowNull: false, defaultValue: () => AccessSubjectToken.getWorkspaceIdFromNamespace() },
    name            : { type: DT.STRING, allowNull: false, unique: true },
    code            : { type: DT.STRING, allowNull: false, unique: true },
    enabled         : { type: DT.BOOLEAN, allowNull: false, defaultValue: true },
    isArchived      : { type: DT.BOOLEAN, allowNull: false, defaultValue: false },
    accessSubjectId : { type: DT.BIGINT, allowNull: true },
    type            : { type: DT.ENUM(AccessSubjectToken.TYPE_NFC, AccessSubjectToken.TYPE_RFID), allowNull: true },
    assignedAt      : { type: DT.DATE(3), allowNull: true },
    createdAt       : { type: DT.DATE(3) },
    updatedAt       : { type: DT.DATE(3) },
    deletedAt       : { type: DT.DELETED_AT_DATE(3), allowNull: false, defaultValue: { [sequelize.Op.eq]: sequelize.literal('0') } }
}, {
    paranoid   : true,
    timestamps : true,
    deletedAt  : 'deletedAt',
    createdAt  : false,
    updatedAt  : false,
    hooks      : {
        beforeUpdate : async (model) => {
            if (model.changed('accessSubjectId')) {
                model.assignedAt = Sequelize.literal('CURRENT_TIMESTAMP(3)');
            }
            if (model.changed('enabled') && model.isArchived) throw new Error('Cannot enable archived entity');
            if (model.changed('isArchived') && model.isArchived) model.enabled = false;
        },
        beforeCreate : (model) => {
            if (model.accessSubjectId) {
                model.assignedAt = Sequelize.literal('CURRENT_TIMESTAMP(3)');
            }
            if (model.enabled && model.isArchived) throw new Error('Cannot enable archived entity');
        },
        beforeSave : async (model, options) => {
            // add or remove token accesses when change "enabled" property of model
            // and this instance is not newly created
            if (model.changed('enabled') && model.previous('enabled') !== undefined) {
                await model.updateReaderTokens(options,
                    { actionType: model.enabled ? ACTION_TYPES.ADD_ACCESS : ACTION_TYPES.REMOVE_ACCESS });
            }

            // remove access only when set "isArchived" to true(when archive the model)
            // and don't add access when set "isArchived" to false(when show the access setting), because
            // model after showing is always disabled and this instance is not newly created
            if (model.changed('isArchived') && model.isArchived === true) {
                await model.updateReaderTokens(options, { actionType: ACTION_TYPES.REMOVE_ACCESS });
            }
        },
        beforeDestroy : async (model, options) => {
            await model.updateReaderTokens(options, { actionType: ACTION_TYPES.REMOVE_ACCESS });
        }
    },
    scopes : {
        ids(ids) {
            if (ids) {
                return {
                    where : { id: ids }
                };
            }

            return {};
        },
        search(search) {
            if (search) {
                return {
                    where : {
                        [Op.or] : [
                            {
                                code : {
                                    [Op.like] : `%${search}%`
                                }
                            },
                            {
                                name : {
                                    [Op.like] : `%${search}%`
                                }
                            },
                            {
                                id : {
                                    [Op.like] : `%${search}%`
                                }
                            }
                        ]
                    }
                };
            }

            return {};
        },
        type(type) {
            if (type) {
                return {
                    where : { type }
                };
            }

            return {};
        },
        enabled(enabled) {
            if (typeof enabled === 'boolean') {
                return {
                    where : { enabled }
                };
            }

            return {};
        },
        isArchived(isArchived) {
            if (typeof isArchived === 'boolean') {
                return {
                    where : { isArchived }
                };
            }

            return {};
        },
        updateDates({ updateStart, updateEnd }) {
            if (updateStart && updateEnd) {
                return {
                    where : {
                        updatedAt : {
                            [Op.gte] : updateStart,
                            [Op.lte] : updateEnd
                        }
                    }
                };
            }

            return {};
        },
        createDates({ createStart, createEnd }) {
            if (createStart && createEnd) {
                return {
                    where : {
                        createdAt : {
                            [Op.gte] : createStart,
                            [Op.lte] : createEnd
                        }
                    }
                };
            }

            return {};
        },
        accessSubjectId(accessSubjectId) {
            if (accessSubjectId || accessSubjectId === null) {
                return {
                    where : { accessSubjectId }
                };
            }

            return {};
        }
    },
    sequelize
});

export default AccessSubjectToken;
