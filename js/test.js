var a = [1,2,3,4,5];
a.splice(1,1);
console.log(a);


// print = (j) => {
//   console.log(a[j]);
// }

// console.log(loopDelayFunction(print, 5, 800));

// function loopDelayFunction(func, n, delay, j = 0) {
//   for (var i = 0; i < n; i++) {
//     (function (i) {
//       setTimeout(function () {
//         func(j);
//         j++;
//       }, delay * i);
//     })(i);
//   };
//   return delay * n;
// }
