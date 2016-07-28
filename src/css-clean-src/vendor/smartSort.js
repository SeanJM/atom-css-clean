const lasso = require('lasso-string');

function smartSort(property) {
  return function (a, b) {
    let aC;
    let bC;
    let aa;
    let bb;
    let n;

    if (typeof property === 'string') {
      a = a[property];
      b = b[property];
    }

  	aa = lasso.matchType(a);
    bb = lasso.matchType(b);

    n = aa.length > bb.length
      ? bb.length
      : aa.length;

    for (var i = 0; i < n; i++) {
    	if (!isNaN(Number(aa[i])) && !isNaN(Number(bb[i]))) {
      	if (Number(aa[i]) > Number(bb[i])) {
        	return 1;
        } else if (Number(aa[i]) < Number(bb[i])) {
  	      return -1;
        }
      }

    	if (aa[i] > bb[i]) {
      	return 1;
      } else if (aa[i] < bb[i]) {
      	return -1;
      }
    }

    return 0;
  };
}

module.exports = smartSort;
