sortCss.list['property group']['background'] = function (a, b) {
  if (/\(/.test(a.value) && !/\(/.test(b.value)) {
    return 1;
  } else if (/\(/.test(a.value) && /\(/.test(b.value)) {
    if (a.value > b.value) {
      return 1;
    }
    return -1;
  }
  return -1;
};
