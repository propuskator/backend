const { initLogger } = require('../lib/extensions/Logger');
const Faker = require('./utils/Faker');

let errorsCount = 0;
let rowsCreated = 0;

const MAX_ERRORS_COUNT = 5;
const REFRESH_PROGRESS_BAR_TIME = 5000;
  
setInterval(() => console.log(`Rows created -  ${rowsCreated}`), REFRESH_PROGRESS_BAR_TIME);

module.exports = class BaseSeed {
    logger = initLogger('Seeds');
    faker = Faker;

    async create(...args) {
        try {
            rowsCreated += 1;

            return await this.createEntity(...args);
        } catch(e) {
            this.logger.warn(e);
            errorsCount += 1;
            if (errorsCount > MAX_ERRORS_COUNT) {
                throw e;
            }
        }
    }

    createEntity() {
        throw new Error('should be implemented');
    }
}

