const mongoose = require('mongoose');

module.exports.validateIdMiddleware = async (ctx, next) => {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.throw(400);
  }
  return next();
};
