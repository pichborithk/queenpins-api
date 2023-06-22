const { faker } = require('@faker-js/faker');

// const user_list = [];

// for (let i = 1; i <= 5; i++) {
//   new_user = {
//     email: faker.internet.email(),
//     name: faker.person.firstName(),
//     password: '123',
//   };
//   user_list.push(new_user);
// }

const product_list = [];
for (let i = 1; i <= 20; i++) {
  new_product = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    quantity: Math.floor(Math.random() * 21),
    urls: [faker.image.url()],
  };
  product_list.push(new_product);
}

module.exports = {
  // user_list,
  product_list,
};
