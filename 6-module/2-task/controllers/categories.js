const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find().then((list) => {
    return list.map((item) => ({
      id: item._id, title: item.title, subcategories: item.subcategories.map((sub) => ({
        id: sub._id,
        title: sub.title,
      })),
    }));
  }).catch(() => []);

  ctx.body = {categories};
  next();
};
