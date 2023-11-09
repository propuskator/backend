const faker = require('faker');

module.exports = class Faker {
    static getRandomName() {
        return faker.random.word() + '-' + faker.random.uuid();
    }
    static getRandomEmail() {
        return faker.random.number() + faker.internet.email();
    }
    static getRandomPhone() {
        return faker.phone.phoneNumber();
    }
    static getRandomImageUrl() {
        return faker.image.imageUrl();
    }
    static getRandomCode() {
        return faker.random.uuid();
    }
}