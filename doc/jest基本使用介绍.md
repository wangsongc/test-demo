# 前端测试



### 市面上主流的前端测试框架

1. Jasmine ： JavaScript测试框架（BDD-集成测试开发框架），这个也算是比较早的测试框架。
2. MOCHA: 它是一个功能丰富的JavaScript测试框架，运行在`Node.js`和浏览器中，使异步测试变得简单有趣。
3. Jest：目前最流行的前端测试框架，几乎国内所有的大型互联网公司都在使用，独有快照测试功能。



### jest基本使用例子

测试TS：jest-ts-demo

测试JS： jest-js-demo

https://github.com/wangsongc/test-demo



### 匹配器（Matchers）

匹配器（Matchers）是Jest中非常重要的一个概念，它可以提供很多种方式来让你去验证你所测试的返回值，官方文档很全，每一种匹配器都有示例

https://www.jestjs.cn/docs/expect

#### **相等匹配器**

这是我们最常用的匹配规则

- toBe

  `toBe`用于`Object`测试完全相等

```
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
```

- toEqual

  检查对象的值使用toEqual，toEqual是通过递归检查对象或数组的每个字段

  ```
  test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
  });
  ```

- .not

  加上`.not`反向匹配

  ```
  test('adding positive numbers is not zero', () => {
    for (let a = 1; a < 10; a++) {
      for (let b = 1; b < 10; b++) {
        expect(a + b).not.toBe(0);
      }
    }
  });
  ```

#### **真实性匹配器**

比如：精准匹配undefined`，`null`以及`false等

- `toBeNull` 仅匹配 `null`

- `toBeUndefined` 仅匹配 `undefined`

- `toBeDefined` 与...相反 `toBeUndefined`

- `toBeTruthy`匹配`if`语句视为真实的任何内容

- `toBeFalsy`匹配`if`语句视为假的任何内容

  

```
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

#### 数字匹配器

- 匹配（比较）数字大小

```
test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe and toEqual are equivalent for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```

对于浮点相等，请使用`toBeCloseTo`代替`toEqual`，因为您不希望测试依赖于微小的舍入误差。

```
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  //expect(value).toBe(0.3);           This won't work because of rounding error
  expect(value).toBeCloseTo(0.3); // This works.
});
```

#### 字符串匹配器

- 使用`toMatch`对正则表达式进行字符串检查

```
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});
```

#### 数组匹配器

- 使用`toContain`检查数组或可迭代项是否包含特定项目

```
const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'milk',
];

test('the shopping list has milk on it', () => {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});
```

#### 异常匹配器

- 使用`toThrow`测试特定函数在调用时是否引发错误

```
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);

  // You can also use the exact error message or a regexp
  expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
  expect(() => compileAndroidCode()).toThrow(/JDK/);
});
```



### 测试异步代码

在JavaScript中，异步运行代码是很常见的。当您具有异步运行的代码时，Jest需要知道它所测试的代码何时完成，然后才能继续进行其他测试。jest有几种处理方法。

#### Callbacks

这是非常常见的通用处理方式，假设您有一个`fetchData(callback)`函数，该函数可获取一些数据并`callback(data)`在完成后调用。您要测试返回的数据是否为字符串`'peanut butter'`，默认情况下当fetchData执行完成的时候Jest的测试就完成了，这并不是你所期望的那样的去运行。

```javascript
// Don't do this!
test('the data is peanut butter', () => {
  function callback(data) {
    expect(data).toBe('peanut butter');
  }

  fetchData(callback);
});
```

上面代码的问题就在于一旦fetchData完成，测试也就执行完成，然后再调用回调(callback是否被调用无法判断)。

jest提供的解决方法：不要将测试放在带有空参数的函数中，而应使用称为的单个参数`done`。Jest将等到`done`回调被调用后再完成测试。

```
test('the data is peanut butter', done => {
  function callback(data) {
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchData(callback);
});
```

如果`done()`从不调用，则测试将失败（带有超时错误），这就是您想要发生的情况。

如果该`expect`语句失败，它将引发错误并且`done()`不会被调用。如果我们想在测试日志中查看失败的原因，我们必须包装`expect`一个`try`块并将该`catch`块中的错误传递给`done`。否则，我们将遇到一个不透明的超时错误，该错误不会显示接收到的值`expect(data)`。

#### Promises

如果您的代码使用Promise，则有一种更简单的方法来处理异步测试。从测试中返回一个承诺，Jest将等待该承诺解决。如果承诺被拒绝，则测试将自动失败。

例如，假设`fetchData`不使用回调，而是返回应解析为string的promise `'peanut butter'`。我们可以用以下方法进行测试：

```
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

如果您希望Promiss被reject，请使用该`.catch`方法。确保添加`expect.assertions`以验证是否调用了一定数量的断言。否则，兑现承诺就不会使测试失败。

```
test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData().catch(e => expect(e).toMatch('error'));
});
```

- `.resolves`/ `.rejects`

  您也可以在`.resolves`Expect语句中使用匹配器，Jest将等待该承诺解决。如果承诺被拒绝，则测试将自动失败

  ```
  test('the data is peanut butter', () => {
    return expect(fetchData()).resolves.toBe('peanut butter');
  });
  
  test('the fetch fails with an error', () => {
    return expect(fetchData()).rejects.toMatch('error');
  });
  ```

  

#### Async/Await

或者，您可以在测试中使用`async`和`await`。要编写异步测试，请`async`在传递给的函数前面使用关键字`test`。例如，`fetchData`可以用以下方法测试同一场景：

```
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```

您可以将`async`和`await`与`.resolves`或结合使用`.rejects`。

```
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toThrow('error');
});
```



### 钩子函数

通常在编写测试时，您需要在测试运行之前进行一些设置工作，而在测试运行后需要进行一些整理工作。Jest提供了辅助功能来处理此问题。

#### `beforeEach`和`afterEach`

如果有很多测试用例执行前后有相同的设置，则可以使用`beforeEach`和`afterEach`。

例如，假设几个测试与城市数据库进行交互。您有一个`initializeCityDatabase()`必须在每个测试之前调用的方法，以及一个`clearCityDatabase()`必须在每个测试之后调用的方法。您可以执行以下操作：

```javascript
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

#### `beforeAll`和`afterAll`

在某些情况下，您只需要在文件开头执行一次设置即可。当设置是异步的时，这尤其麻烦，因此您不能内联。jest提供`beforeAll`并`afterAll`处理这种情况。

例如，如果承诺`initializeCityDatabase`和`clearCityDatabase`返回的承诺都可以使用，并且城市数据库可以在测试之间重用，则可以将测试代码更改为：

```javascript
beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

#### **钩子函数的作用域**

默认情况下，`before`和`after`块适用于文件中的每个测试。您也可以使用`describe`块将测试分组在一起。当它们在一个`describe`块内时，`before`和`after`块仅适用于该`describe`块内的测试。

- 钩子函数在父级分组可作用域子集，类似继承
- 钩子函数同级分组作用域互不干扰，各起作用
- 先执行外部的钩子函数，再执行内部的钩子函数

```
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 sausage', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});
```

钩子函数执行顺序，顶层`beforeEach`是`beforeEach`在`describe`块内部之前执行的

```javascript
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

一般建议：test.only可以指定仅运行哪个用例，方便定位和修复问题。



### mock功能

Mock函数允许您通过擦除函数的实际实现，捕获对该函数的调用（以及在这些调用中传递的参数），捕获用实例化的构造函数的实例`new`以及允许对它们进行测试时配置来测试代码之间的链接。返回值。

有两种模拟函数的方法：通过创建要在测试代码中使用的模拟函数，或编写[`manual mock`](https://www.jestjs.cn/docs/manual-mocks)来重写模块依赖性。

#### mock函数

假设我们正在测试一个函数的实现，该函数`forEach`为提供的数组中的每个项目调用一个回调。

```javascript
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```

为了测试此功能，我们可以使用模拟功能，并检查模拟的状态以确保按预期方式调用回调。

```javascript
const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// The mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

// The first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// The return value of the first call to the function was 42
expect(mockCallback.mock.results[0].value).toBe(42);
```

#### `.mock` 属性

所有模拟函数都具有此特殊`.mock`属性，该属性用于保存有关如何调用函数以及返回的函数的数据。该`.mock`属性还跟踪`this`每个调用的值，因此也可以检查此值：

```javascript
const myMock = jest.fn();

const a = new myMock();
const b = {};
const bound = myMock.bind(b);
bound();

console.log(myMock.mock.instances);
// > [ <a>, <b> ]
```

这些模拟成员在断言这些函数如何被调用，实例化或它们返回什么的测试中非常有用：

```javascript
// The function was called exactly once
expect(someMockFunction.mock.calls.length).toBe(1);

// The first arg of the first call to the function was 'first arg'
expect(someMockFunction.mock.calls[0][0]).toBe('first arg');

// The second arg of the first call to the function was 'second arg'
expect(someMockFunction.mock.calls[0][1]).toBe('second arg');

// The return value of the first call to the function was 'return value'
expect(someMockFunction.mock.results[0].value).toBe('return value');

// This function was instantiated exactly twice
expect(someMockFunction.mock.instances.length).toBe(2);

// The object returned by the first instantiation of this function
// had a `name` property whose value was set to 'test'
expect(someMockFunction.mock.instances[0].name).toEqual('test');
```

#### mock返回值

模拟功能还可用于在测试期间将测试值注入代码中：

```javascript
const myMock = jest.fn();
console.log(myMock());
// > undefined

//第一次调用时返回10，第二次调用时返回x，之后的调用全部返回true
myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true
```

模拟函数在使用函数连续传递样式的代码中也非常有效。用这种风格编写的代码有助于避免使用复杂的存根来重新创建其所代表的实际组件的行为，从而有利于在使用它们之前将值直接注入测试中。

```javascript
const filterTestFn = jest.fn();

// Make the mock return `true` for the first call,
// and `false` for the second call
filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

const result = [11, 12].filter(num => filterTestFn(num));

console.log(result);
// > [11]
console.log(filterTestFn.mock.calls[0][0]); // 11
console.log(filterTestFn.mock.calls[0][1]); // 12
```

实际上，大多数实际示例都涉及在依赖组件上获取模拟功能并对其进行配置，但是技术是相同的。在这种情况下，请尝试避免在任何未经直接测试的功能内实现逻辑的诱惑。

#### mock模块

假设我们有一个从API获取用户的类。该类使用[axios](https://github.com/axios/axios)调用API，然后返回`data`包含所有用户的属性：

```javascript
// users.js
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;
```

现在，为了在不实际访问API的情况下测试该方法（从而创建缓慢而脆弱的测试），我们可以使用该`jest.mock(...)`函数自动模拟axios模块。

一旦对模块进行了模拟，我们就可以提供一个`mockResolvedValue`for `.get`，以返回我们要针对测试进行断言的数据。实际上，我们是说我们要`axios.get('/users.json')`返回一个假响应。

```javascript
// users.test.js
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

#### mock实现

但是，在某些情况下，超越指定返回值的功能并完全替换模拟功能的实现是有用的。这可以通过模拟函数`jest.fn`或`mockImplementationOnce`方法来完成。

```javascript
const myMockFn = jest.fn(cb => cb(null, true));

myMockFn((err, val) => console.log(val));
// > true
```

`mockImplementation`当您需要定义从另一个模块创建的模拟函数的默认实现时，该方法很有用： 	

```javascript
// foo.js
module.exports = function () {
  // some implementation;
};

// test.js
jest.mock('../foo'); // this happens automatically with automocking
const foo = require('../foo');

// foo is a mock function
foo.mockImplementation(() => 42);
foo();
// > 42
```

当您需要重新创建模拟函数的复杂行为以使多个函数调用产生不同的结果时，请使用以下`mockImplementationOnce`方法：

```javascript
const myMockFn = jest
  .fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val));
// > true

myMockFn((err, val) => console.log(val));
// > false
```

当模拟功能用完了用定义的实现时`mockImplementationOnce`，它将执行用`jest.fn`（如果定义）的默认实现集：

```javascript
const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call');

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
// > 'first call', 'second call', 'default', 'default'
```

对于通常具有链式方法（因此总是需要返回`this`）的情况，我们提供了一个含糖的API以简化`.mockReturnThis()`函数的形式简化此过程，该函数也位于所有模拟中：

```javascript
const myObj = {
  myMethod: jest.fn().mockReturnThis(),
};

// is the same as

const otherObj = {
  myMethod: jest.fn(function () {
    return this;
  }),
};
```

#### mock名称

您可以选择为模拟函数提供一个名称，该名称将在测试错误输出中显示，而不是显示“ jest.fn（）”。如果您希望能够快速识别在测试输出中报告错误的模拟功能，请使用此功能。

```javascript
const myMockFn = jest
  .fn()
  .mockReturnValue('default')
  .mockImplementation(scalar => 42 + scalar)
  .mockName('add42');
```

### 自定义匹配器

最后，为了减少对如何调用模拟函数的断言的要求，我们为您添加了一些自定义匹配器函数：

```javascript
// The mock function was called at least once
expect(mockFunc).toHaveBeenCalled();

// The mock function was called at least once with the specified args
expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

// The last call to the mock function was called with the specified args
expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

// All calls and the name of the mock is written as a snapshot
expect(mockFunc).toMatchSnapshot();
```

这些匹配器是检查`.mock`财产的常用形式的糖。如果这更符合您的口味，或者您需要做一些更具体的操作，则可以始终手动进行此操作：

```javascript
// The mock function was called at least once
expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

// The mock function was called at least once with the specified args
expect(mockFunc.mock.calls).toContainEqual([arg1, arg2]);

// The last call to the mock function was called with the specified args
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([
  arg1,
  arg2,
]);

// The first arg of the last call to the mock function was `42`
// (note that there is no sugar helper for this specific of an assertion)
expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1][0]).toBe(42);

// A snapshot will check that a mock was invoked the same number of times,
// in the same order, with the same arguments. It will also assert on the name.
expect(mockFunc.mock.calls).toEqual([[arg1, arg2]]);
expect(mockFunc.getMockName()).toBe('a mock name');
```

### 配置jest

https://www.jestjs.cn/docs/configuration



### 测试框架引入遇到的问题

#### 解决md导入的问题

```
    D:\work\songwang\mavonEditor\src\lib\lang\zh-CN\help_zh-CN.md:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){@[toc](目录)
                                                                                             ^

    SyntaxError: Invalid or unexpected token

      11 |  */
      12 | 
    > 13 | import help_zh_CN from './lang/zh-CN/help_zh-CN.md'
         | ^
      14 | import help_zh_TW from './lang/zh-TW/help_zh-TW.md'
      15 | import help_en from './lang/en/help_en.md'
      16 | import help_fr from './lang/fr/help_fr.md'

      at ScriptTransformer._transformAndBuildScript (node_modules/jest-runtime/build/script_transformer.js:403:17)
      at Object.<anonymous> (src/lib/config.js:13:1)
```

- 解决办法：

```
transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.vue$": "<rootDir>/node_modules/vue-jest",
    // "^.+\\.(md|mdx)$": "jest-transformer-mdx",
    '.*\\.(yml|html|md)$': 'jest-raw-loader'  //解决md导入的问题
  }
```

#### 解决外部module引入问题

无法引入外部模块auto-textarea

- 解决办法：

```
transformIgnorePatterns: ["<rootDir>/node_modules/(?!auto-textarea|@vue|src)"],
```



#### 解析markdown失败

```
    D:/work/songwang/mavonEditor/src/lib/lang/zh-CN/help_zh-CN.md: Unexpected token (14:9)

      Jest encountered an unexpected token
      This usually means that you are trying to import a file which Jest cannot parse, e.g. it's not plain JavaScript.
      By default, if Jest sees a Babel config, it will use that to transform your files, ignoring "node_modules".
      Here's what you can do:
       • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config. 
       • If you need a custom transformation specify a "transform" option in your config.
       • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.
      You'll find more details and examples of these config options in the docs:
      https://jestjs.io/docs/en/configuration.html
      Details:
        12 |   ...props
        13 | }) {
      > 14 |   return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">
           |          ^
        15 | 
        16 |     <h1>{`Markdown 语法简介`}</h1>
        17 |     <blockquote>

Test Suites: 1 failed, 1 total
```

- 解决方法：

使用`"^.+\\.(md|mdx)$": "jest-transformer-mdx",`无法解决，正确解决方式如下：

```
transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.vue$": "<rootDir>/node_modules/vue-jest",
    // "^.+\\.(md|mdx)$": "jest-transformer-mdx",
    '.*\\.(yml|html|md)$': 'jest-raw-loader'  //解决md导入的问题
  }
```



#### 引入css文件失败

```
    D:\work\songwang\mavonEditor\src\lib\font\css\fontello.css:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){@font-face {
                                                                                             ^

    SyntaxError: Invalid or unexpected token

      120 | import md_toolbar_left from './components/md-toolbar-left.vue'
      121 | import md_toolbar_right from './components/md-toolbar-right.vue'
    > 122 | import "./lib/font/css/fontello.css"
          | ^
      123 | import './lib/css/md.css'
      124 | export default {
      125 |     mixins: [markdown],

      at ScriptTransformer._transformAndBuildScript (node_modules/jest-runtime/build/script_transformer.js:403:17)
      at src/mavon-editor.vue:122:1
      at Object.<anonymous> (src/mavon-editor.vue:633:3)
```

- 解决办法：

```
moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy', //解决css引入失败
    '^@/(.*)$': '<rootDir>/src/$1'
  },
```



#### TypeError: Cannot read property 'focus' of undefined

```
    × renders props.msg when passed (268ms)

  ● MdToolbarLeft.vue › renders props.msg when passed   

    TypeError: Cannot read property 'focus' of undefined

      335 |         // 设置默认焦点
      336 |         if (this.autofocus) {
    > 337 |             this.getTextareaDom().focus();
          | ^
      338 |         }
      339 |         // fullscreen事件
      340 |         fullscreenchange(this);

      at VueComponent.mounted (src/mavon-editor.vue:337:1)
      at invokeWithErrorHandling (node_modules/vue/dist/vue.runtime.common.dev.js:1850:57)
      at callHook (node_modules/vue/dist/vue.runtime.common.dev.js:4207:7)
      at Object.insert (node_modules/vue/dist/vue.runtime.common.dev.js:3133:7)
      at invokeInsertHook (node_modules/vue/dist/vue.runtime.common.dev.js:6326:28)
      at VueComponent.patch [as __patch__] (node_modules/vue/dist/vue.runtime.common.dev.js:6543:5)
      at VueComponent.Vue._update (node_modules/vue/dist/vue.runtime.common.dev.js:3933:19)
      at VueComponent.updateComponent (node_modules/vue/dist/vue.runtime.common.dev.js:4054:10)
      at Watcher.get (node_modules/vue/dist/vue.runtime.common.dev.js:4465:25)
      at new Watcher (node_modules/vue/dist/vue.runtime.common.dev.js:4454:12)
      at mountComponent (node_modules/vue/dist/vue.runtime.common.dev.js:4061:3)
      at VueComponent.$mount (node_modules/vue/dist/vue.runtime.common.dev.js:8392:10)
      at mount (node_modules/@vue/test-utils/dist/vue-test-utils.js:13991:21)
      at shallowMount (node_modules/@vue/test-utils/dist/vue-test-utils.js:14017:10)
      at Object.<anonymous> (tests/unit/md-toolbar-left.spec.js:6:21)
```

- 解决办法：

增加nextTick()

```
if (this.autofocus) {
            this.$nextTick(function () { this.getTextareaDom().focus(); });
            
        }
```



#### 对带有空格的class取元素需将空格替换成`.`导入外部module（autotext）在测试时渲染失败

```
    [Vue warn]: Failed to mount component: template or render function not defined.
    
    found in
    
    ---> <VAutoTextarea>
           <Anonymous>
             <Root>
```

- 解决方法：

1.修改源码，将auto-textarea由`import {autoTextarea} from 'auto-textarea'`改为`import autoTextarea from 'auto-textarea/auto-textarea.vue' `

2.使用vue-test-util的stub选项将auto-textarea组件替换引入加载

```javascript
describe('xxxx', () => {
  test("xxxxxtest",()=>{
    let w =  mount(MavonEditor,{
      stubs:{
        "v-autoTextarea":autoTextarea
      }
    })
  }) 
});
```



#### 出现Error: Not implemented: window.alert错误

```
  console.error node_modules/jest-environment-jsdom/node_modules/jsdom/lib/jsdom/virtual-console.js:29
      Error: Not implemented: window.alert
```

- 解决方法：

`window.alert`以及其他一些特定于浏览器的副作用，需要手动添加。最好使用Jest完成此操作，以便可以跟踪并清理间谍：

```
jest.spyOn(window, 'alert').mockReturnValue();
```




