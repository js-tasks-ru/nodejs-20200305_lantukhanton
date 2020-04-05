const Category = require('./models/Category');
const Product = require('./models/Product');

const mongoose = require('mongoose');

const cats = ['books', 'toys', 'instruments', 'games'];
const prods = ['Peace and war', 'toys', 'instruments', 'games'];

const categories = async () => Promise.all(cats.map(
    (c) => Category.create({
      title: c,
      subcategories: [],
    }))
);

const products = async () => Promise.all(prods.map(
    (p) => Product.create({
      title: p,
      description: 'Great',
      price: 1200,
      category: new mongoose.Types.ObjectId('5e89f325a8ce6f42fe63a03e'),
      subcategory: new mongoose.Types.ObjectId('5e89f325a8ce6f42fe63a03e'),
    }))
);

mongoose.createConnection('mongodb://localhost/any-shop')
    .then(() => categories())
    .then(() => products())
    .then(() => mongoose.disconnect());
