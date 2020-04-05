const Product = require('../models/Product');
const {parseProduct} = require('../responseHandlers');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.query.subcategory;

  if (!subcategory) return next();
  const products = await Product.find({subcategory}).populate({
    path: 'category',
  });

  ctx.body = {
    products: products.map(parseProduct),
  };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({}).populate({
    path: 'category',
  });

  ctx.body = {
    products: products.map(parseProduct),
  };
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  const product = await Product.findById(id);

  if (!product) ctx.throw(404);

  await product.populate({
    path: 'category',
  });

  ctx.body = {
    product: parseProduct(product),
  };
};

