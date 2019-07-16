const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find().then((item) => ({
    id: item._id,
    title: item.title,
    subcategories: item.map((sub) => ({
      id: sub._id,
      title: sub.title,
    })),
  })).catch(() => []);

  ctx.body = {categories};
};
