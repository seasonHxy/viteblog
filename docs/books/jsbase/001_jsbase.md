# JavaScript 基础概念

::: tip
以下内容包括：数据类型，对象相关，函数相关，数据操作.
:::

## 数据类型

**1.JS原始数据类型和引用数据类型有哪些？**

在 JS 中，存在着 6 种原始类型，分别是：

- boolean
- null
- undefined
- number
- string
- symbol

- 引用数据类型:
  - 对象-Object
  - 数组对象-Array
  - 正则对象-RegEx
  - 日期对象-Date
  - 数学函数-Math
  - 函数对象-Function

**2.例举：Object，Array，RegEx，Date，Math，操作方法**

- Object包括静态方法和实例方法
![An image](/js/object_static_func.png)
![An image](/js/object_shili_func.png)

- Array包括静态方法和实例方法(分为修改型，访问型，迭代型)
![An image](/js/array_static_func.png)
![An image](/js/array_shili_read_func.png)
![An image](/js/array_shili_update_func.png)
![An image](/js/array_shili_iterator_func.png)


**3.解释null是对象吗？**
    
解释: 不是对象，虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。
在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，
000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。


**4.'2'.toString()可以调用？**
这个语句运行的过程中做了这样几件事情：
第一步: 创建String类实例。

第二步: 调用实例方法。

第三步: 执行完方法立即销毁这个实例。

整个过程体现了基本包装类型的性质，而基本包装类型恰恰属于基本数据类型，包括 Boolean, Number 和 String。

```js
var s = new String('2');
s.toString();
s = null;
```


**5.   0.1+0.2=0.3？**

0.1和0.2在转换成二进制后会无限循环，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成0.30000000000000004。

**6. 说出下面运行的结果，解释原因**
```js
function test(person) {
  person.age = 33
  person = {
    name: 'bar',
    age: 18
  }
  return person
}
const p1 = {
  name: 'foo',
  age: 19
}
const p2 = test(p1)
console.log(p1) //  ?
console.log(p2) //  ?
```
::: details
结果:
```js
p1：{name: "foo", age: 33}
p2：{name: "bar", age: 18}
```
原因: 在函数传参的时候传递的是对象在堆中的内存地址值，test函数中的实参person是p1对象的内存地址，通过调用person.age = 26确实改变了p1的值，但随后person变成了另一块内存空间的地址，并且在最后将这另外一份内存空间的地址返回，赋给了p2。
:::


## 数据类型的判断

**1. typeof 是否能正确判断类型？**
对于原始类型来说，除了 null 都可以调用typeof显示正确的类型。
```js
typeof 2 // 'number'
typeof '2' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
```
但对于引用数据类型，除了函数之外，都会显示"object"。
```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```
因此采用typeof判断对象数据类型是不合适的，采用instanceof会更好，instanceof的原理是基于原型链的查询，只要处于原型链中，判断永远为true;instanceof也能判断基本数据类型。
```js
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

var str1 = 'hello world'
str1 instanceof String // false

var str2 = new String('hello world')
str2 instanceof String // true
```

**2、能不能手动实现一下instanceof的功能？**
```js
function myInstanceof(left, right){
  if(left === null) return false
  const left_proto = Object.getPrototypeOf(left)
  while(true) {
    if (left_proto === null) return false;
    if(left_proto === right.prototype) return true
    left_proto = Object.getPrototypeOf(left_proto)
  }
}

console.log(myInstanceof("foo", String))

```
**3、所有判断类型方法**

![An image](/js/object_type_judge.png)


## 类型转换的判断
**1. [] == ![]结果是什么？讲述下过程**

::: details
解析:

== 中，左右两边都需要转换为数字然后进行比较。

[]转换为数字为0。

![] 首先是转换为布尔值，由于[]作为一个引用类型转换为布尔值为true, 因此![]为false，进而在转换成数字，变为0。

0 == 0 ， 结果为true
:::

**2、类型转换的方法**
- JS中，类型转换只有三种：
  - 转换成数字
  - 转换成布尔值
  - 转换成字符串
![An image](/js/object_type_show.png)
![An image](/js/object_type_change.png)
![An image](/js/object_type_hidden.png)


**3.  如何让if(a == 1 && a == 2)条件成立？解释原因**
::: details
结果:
```js
var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  }
};
console.log(a == 1 && a == 2);//true

```
::: 


## JS 变量

![An image](/js/js_param.png)

## JS 函数

<!-- ![An image](/js/js_function.jpg) -->
![An image](/js/js_function_1.png)
![An image](/js/js_function_2.png)

## JS 闭包
![An image](/js/js_bibao.png)
**循环输出问题**
![An image](/js/js_bibao_timu.png)
还有一种：使用setTimeout包裹，通过第三个参数传入。
（注：setTimeout后面可以有多个参数，从第三个参数开始其就作为回掉函数的附加参数）
```js
for(var i=1;i<=5;i++){
  setTimeout(function timer(j){
    console.log(j)
  }, 0, i)
}
```

## JS 原型
![An image](/js/js_proto.png)
## JS 原型链
![An image](/js/js_prototype.png)

## JS 函数的执行中-代码的整体执行过程
![An image](/js/js_whole_process.png)