parseSubcategory = ({
  _id,
  title,
}) => ({id: _id, title});

module.exports.parseCategory = ({
  _id,
  title,
  subcategories,
}) => ({id: _id, title, subcategories: subcategories.map(parseSubcategory)});

module.exports.parseProduct = ({
  _id,
  title,
  description,
  price,
  category,
  subcategory,
  images,
}) => ({id: _id, title, description, price, category, subcategory, images});

module.exports.parseProducts = (products) => products.map(parseProduct);
