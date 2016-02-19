function smartSort(property) {
  return function (a, b) {
    var aC;
    var bC;
    if (typeof property === 'string') {
      a = a[property];
      b = b[property];
    }
  	var aa = lasso.matchType(a);
    var bb = lasso.matchType(b);
    var n = aa.length;
    if (aa.length > bb.length) {
    	n = bb.length;
    }
    for (var i = 0; i < n; i++) {
    	if (!isNaN(Number(aa[i])) && !isNaN(Number(bb[i]))) {
      	if (Number(aa[i]) > Number(bb[i])) {
        	return 1;
        } else if (Number(aa[i]) < Number(bb[i])) {
  	      return -1
        }
      }
    	if (aa[i] > bb[i]) {
      	return 1;
      } else if (aa[i] < bb[i]) {
      	return -1;
      }
    }
    return 0;
  }
};
