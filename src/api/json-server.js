const faker = require('faker');

function createUser(id = faker.random.uuid()) {
  return {
    id,
    type: 'user',
    displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    active: true,
    avatarUrl: faker.image.avatar(),
  };
}

function createCard(id = faker.random.uuid(), { users }) {
  const createdAt = faker.date.past(0).toISOString();
  return {
    id,
    type: 'card',
    title: faker.lorem.sentence(),
    previewContent: faker.lorem.paragraphs(2),
    content: faker.lorem.paragraphs(6),
    updatedAt: faker.date.past(0, createdAt).toISOString(),
    createdAt,
    owner: faker.random.arrayElement(users),
    savedCount: faker.random.number({ min: 0, max: 10 }),
  };
}

function createList(count, creator) {
  return Array.from({ length: count }, () => creator());
}

module.exports = () => {
  const db = {
    users: [],
    cards: [],
  };

  db.users = createList(10, createUser);

  db.cards = createList(50, () => createCard(undefined, db));

  return db;
};
