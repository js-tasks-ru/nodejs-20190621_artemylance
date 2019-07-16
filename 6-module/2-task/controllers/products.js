const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const products = await Product.find({subcategory: ctx.query.subcategory}).then((list) => {
    return list.map((product) => ({
      id: product._id,
      title: product.title,
      description: product.description,
      images: product.images,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
    }));
  }).catch(()=>[]);

  ctx.body = {products};
  next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products};
  next();
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  try {
    const product = await Product.findOne({'_id': id});
    ctx.body = {product: {...product, id: product._id}};
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      ctx.throw(400, 'invalid id');
    } else {
      ctx.throw(404, 'Product not found');
    }
  }

  next();
};
