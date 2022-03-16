//- TS 也提供了 typeof 操作符：可以在类型上下文中引用变量或属性的类型（类型查询）
//- 使用场景:根据已有变量的值，获取该值的类型，来简化类型书写

let obj = {
  x: 10,
  y: 20,
}

type Obj = typeof obj

function show(obj: Obj) {
  console.log(obj.x)
  console.log(obj.y)
}

//将来调用一些第三方库，第三方库的配置对象
//现在的第三方库，都是基于ts去写的

/*
1. 使用 `typeof` 操作符来获取变量 p 的类型，结果与第一种（对象字面量形式的类型）相同
2. typeof 出现在**类型注解的位置（参数名称的冒号后面）所处的环境就在类型上下文**(区别于 JS 代码)
3. 注意：typeof 只能用来查询变量或属性的类型，无法查询其他形式的类型（比如，函数调用的类型）
*/
