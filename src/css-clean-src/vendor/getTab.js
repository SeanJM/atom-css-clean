module.exports = function (that, depth) {
  return new Array((depth * that.tabSize) + 1).join(that.tabChar);
};
