const AccessSubjectsCreate = require('../../../../lib/services/admin/accessSubjects/Create');
const UserRegister = require('../../../../lib/services/mobile/users/Register');
const UserDelete = require('../../../../lib/services/mobile/users/Delete');

async function registerUser({ email, workspace, password }, accessSubject = {}) {
    await new AccessSubjectsCreate({ context: {} }).run({
        name : 'name',
        position : 'position',
        phone : '+380000000000',
        email,
        canAttachTokens: true,
        mobileEnabled: true,
        phoneEnabled: true,
        ...accessSubject
    });

    const { 
        data : {
            user,
            accessSubject : registeredAccessSubject
        },
        meta : { token }
    } = await new UserRegister({ context: {} }).run({
        workspace ,
        email,
        password,
        passwordConfirm : password
    });

    return { user, subject: registeredAccessSubject, token };
}

async function deleteUser(id) {
    const deleteService = new UserDelete({ context: {} });

    deleteService.cls.set('userId', id);

    const { data: { id: userId } } = await deleteService.run({});

    return userId;
}

module.exports = { registerUser, deleteUser };
