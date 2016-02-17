// sortCss.scope.block = function (settings, cssObject) {
//   var scope = {};
//   var start = 0;
//   var name;
//   while (cssObject[start].scope.substr(0, 7) === 'comment') {
//     start += 1;
//   }
//   for (var i = 0, n = sortCss.scope.block.list.length; i < n; i++) {
//     scope[sortCss.scope.block.list[i]] = [];
//   }
//   for (i = cssObject.length - 1; i >= start; i -= 1) {
//     if (sortCss.scope.block.list.indexOf(cssObject[i].scope) !== -1) {
//       scope[cssObject[i].scope].push(cssObject[i]);
//       cssObject.splice(i, 1);
//     }
//   }
//   for (var i = 0, n = cssObject.length; i < n; i++) {
//     name = cssObject[i].scope;
//     if (sortCss.scope.block.list.indexOf(name) !== -1 && typeof sortCss.list[name] === 'function') {
//       sortCss.list[name](settings, cssObject[i]);
//     }
//     if (sortCss.scope.block.each.indexOf(name) !== -1 && typeof sortCss.each[name] === 'function') {
//       sortCss.each[name](settings, cssObject[i]);
//     }
//   }
// };
