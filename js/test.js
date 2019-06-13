var num = 2;

function add() {
    num++;
}

add();
console.log(num);


//*below passed
// function sayHi(n) {
//     if (n === 10) {
//         return;
//     }

//     setTimeout(function() {
//         console.log(n + ' say hi!');
//     }, n*2000);
//     return sayHi(n+1);
// }

// sayHi(1);

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
