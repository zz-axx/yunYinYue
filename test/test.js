let arr = [2,3,4,5,6,7]

// splice(start, deleteCount) 会修改原数组
// console.log(arr.splice(2, 2));
// console.log(arr);

// slice(start, end?) 不会修改原数组， 截取包含起始位置，不包含结束位置元素

console.log(arr.slice(2, 4));
console.log(arr);

console.log('****************************');
// <<< || >>>位移运算符
let num = 3;
// 0000 0011
//  00000 001

console.log(num>>>1); // 1
console.log(num>>>2); // 0

// 右移 0 位， 可以将非布尔值转换成布尔值


console.log('***********************************');
let arr2 = [{name: 'kobe'}, {name: 'curry'}, {name: 'wade'}]
console.log(arr2.find(item => item.name === 'curry')); // {name: 'curry'}
console.log(arr2.find(item => item.name === 'xxxx'));// undefined

