const { faker } = require('@faker-js/faker');

const user_list = [];

for (let i = 1; i <= 10; i++) {
  new_user = {
    email: faker.internet.email(),
    name: faker.person.firstName(),
    password: '123',
  };
  user_list.push(new_user);
}

const product_list = [];

const product_type_list = ['new', 'trending', 'sale'];

for (let i = 1; i <= 20; i++) {
  new_product = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    quantity: Math.round(Math.random() * 50),
    type: product_type_list[
      Math.floor(Math.random() * product_type_list.length)
    ],
  };
  product_list.push(new_product);
}

module.exports = {
  user_list,
  product_list,
};
