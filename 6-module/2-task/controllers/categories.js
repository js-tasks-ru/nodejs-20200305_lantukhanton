const Category = require('../models/Category');
const {parseCategory} = require('../responseHandlers');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});

  ctx.body = {
    categories: categories.map(parseCategory),
  };
};
