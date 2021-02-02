# Vue-Test-Utils + Jest 单元测试入门级介绍
---

## 前言 

关于vue应用前端测试主要有三大类：

- 单元测试
- 组件测试
- 端到端 (E2E，end-to-end) 测试

### 单元测试

![image-20210120094315660](C:\Users\91579\AppData\Roaming\Typora\typora-user-images\image-20210120094315660.png)

**单元测试(unit testing):**是指对软件中的最小可测试单元进行检查和验证。代码的终极目标有两个，第一个是实现需求，第二个是提高代码质量和可维护性。单元测试是为了提高代码质量和可维护性，是实现代码的第二个目标的一种方法。对vue组件的测试是希望组件行为符合我们的预期。

**主流vue单元测试框架**

**Jest:**一个专注于简易性的 JavaScript 测试框架。其一大特点就是就是内置了常用的测试工具，比如自带断言、测试覆盖率工具，实现了开箱即用，Jest 的测试用例是并行执行的，而且只执行发生改变的文件所对应的测试，提升了测试速度，此外还有一个独特的功能是可以为测试生成快照 (snapshot)，以提供另一种验证应用单元的方法。

**Mocha:**一个专注于灵活性的 JavaScript 测试框架。因为其灵活性，它允许你选择不同的库来满足诸如侦听 (如 Sinon) 和断言 (如 Chai) 等其它常见的功能。另一个 Mocha 独特的功能是它不止可以在 Node.js 里运行测试，还可以在浏览器里运行测试。

### 组件测试

**Vue Testing Library (@testing-library/vue)**

Vue Testing Library 是一组专注于测试组件而不依赖实现细节的工具。由于在设计时就充分考虑了可访问性，它采用的方案也使重构变得轻而易举。

它的指导原则是，与软件使用方式相似的测试越多，它们提供的可信度就越高。

 **Vue Test Utils**

Vue Test Utils 是官方的偏底层的组件测试库，它是为用户提供对 Vue 特定 API 的访问而编写的。如果你对测试 Vue 应用不熟悉，我们建议你使用 Vue Testing Library，它是 Vue Test Utils 的抽象。



**小结：**

当前vue技术领域jest被大量使用，包括vue-next，加之[`Vue-Test-Utils`](https://vue-test-utils.vuejs.org/zh/) 是 `Vue.js` 官方的单元测试实用工具库，它提供了一系列的 `API` 来使得我们可以很便捷的去写 `Vue` 应用中的单元测试。故本文针对`jest`+`vue-test-utils`进行介绍。



## 环境配置

通过脚手架 `vue-cli` 来新建项目的时候，如果选择了 `Unit Testing` 单元测试且选择的是 `Jest` 作为测试运行器，那么在项目创建好后，就会自动配置好单元测试需要的环境，直接能用 `Vue-Test-Utils` 和 `Jest` 的 `API` 来写测试用例了。

如果老项目或新建项目时没有选择单元测试功能，则需要手动添加测试依赖并配置：

**第一种配置**

直接在项目中添加一个 [`unit-jest`](https://github.com/vuejs/vue-docs-zh-cn/tree/master/vue-cli-plugin-unit-jest) 插件，会自动将需要的依赖安装配置好。

```
vue add @vue/unit-jest
```

**第二种配置**

这种配置会麻烦一点，下面是具体的操作步骤。

- 安装 `Jest` 和 `Vue Test Utils`

    ```
    npm install --save-dev jest @vue/test-utils
    ```
- 安装 `babel-jest` 、 `vue-jest` 和 `7.0.0-bridge.0` 版本的 `babel-core`

    ```
    npm install --save-dev babel-jest vue-jest babel-core@7.0.0-bridge.0
    ```
    
- 安装 `jest-serializer-vue`

    ``` 
    npm install --save-dev jest-serializer-vue
    ```
    
- 配置 `Jest`

运行`npx jest --init`在当前目录生成jest.config.j文件，根据需要参考[官方文档](https://www.jestjs.cn/docs/configuration)进行配置。

``` js
module.exports = {
  // 所有配置项：https://jestjs.io/docs/en/configuration.html#defaults

  // 引入预设值：vuecli3生成项目时的默认值
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',

  // 以下都是自己添加的新增设置或者覆盖默认值

  // 引入自定义设置文件
  setupFiles: ['./test/setup.ts'],

  // 指定测试文件范围
  testMatch: [
    '**/__tests__/*.[jt]s?(x)', // __tests__文件夹内的ts/js文件
    '**/?(*.)(spec|test).[jt]s?(x)' // 任意文件夹内的spec.ts/test.ts结尾的文件
  ],

  // 显示每一个测试的结果
  verbose: true,

  // 指定哪些文件收集覆盖率，亦或是排除那些文件，一般入口文件App.vue会被排除
  // 或者设置文件、结构非常简单的文件、其他插件文件等，视具体情况适当排除
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}', // src下所有js/ts/vue文件
    '!src/components/**/*.{js,ts}', // components文件夹下只收集vue文件的覆盖率，不然不能正常显示覆盖率
    '!src/App.vue', // 入口文件排除
    '!src/main.ts', // 设置文件排除
    '!src/router/index.ts', // 路由设置文件排除（如果自己指定了不同情况下的路由守卫时，可适当测试）
    '!src/plugins/*.{js,ts}', // 插件设置文件，一般不需测试，有时根据项目需求，需要增加设置，可视情况添加测试
    '!src/store/index.ts' // 排除store 的配置文件，不包含state/mutations/actions/getters
  ],

  /**
   * 指定测试最低覆盖率
   * 一般由开发人员商定，项目复杂程序越高，覆盖率指数越低
   * 此处暂定80
   */
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // 指定snapshot测试的序列化模块
  snapshotSerializers: ['jest-serializer-vue'],
}
```



## 使用CLI创建Vue测试项目

### 用 `vue-cli` 创建一个项目

下载最新的vue-cli@4（目前同时支持vue2和vue3项目创建）

```
npm install -g @vue/cli@4
```

开始创建项目：

``` 
vue create vue-jest-demo
```

键盘上下键选中 `Manually select features` ，Enter键进行手动选择功能配置：

```
Vue CLI v4.5.10
? Please pick a preset:
  Default ([Vue 2] babel, eslint)
  Default (Vue 3 Preview) ([Vue 3] babel, eslint) 
> Manually select features
```

键盘上下键选中 `Unit Testing`，空格键勾选，Enter下一步：

```
Vue CLI v4.5.10
? Please pick a preset: Manually select features
? Check the features needed for your project: 
 (*) Choose Vue version
 (*) Babel
 ( ) TypeScript
 ( ) Progressive Web App (PWA) Support        
 ( ) Router
 ( ) Vuex
 ( ) CSS Pre-processors
 (*) Linter / Formatter
>(*) Unit Testing
 ( ) E2E Testing
```

选中3.x，Enter确认，表示以vue3创建项目:

```
Vue CLI v4.5.10
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, Linter, Unit
? Choose a version of Vue.js that you want to start the project with 
  2.x
> 3.x (Preview)
```

选择eslint配置：

```
Vue CLI v4.5.10
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, Linter, Unit
? Choose a version of Vue.js that you want to start the project with 3.x (Preview)
? Pick a linter / formatter config: (Use arrow keys)
> ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
  ESLint + Prettier
  
Vue CLI v4.5.10
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, Linter, Unit
? Choose a version of Vue.js that you want to start the project with 3.x (Preview)
? Pick a linter / formatter config: Basic
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) Lint on save
 ( ) Lint and fix on commit
```

选择测试方案jest：

``` 
Vue CLI v4.5.10
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, Linter, Unit
? Choose a version of Vue.js that you want to start the project with 3.x (Preview)
? Pick a linter / formatter config: Basic
? Pick additional lint features: Lint on save   
? Pick a unit testing solution: 
  Mocha + Chai
> Jest
```
选择独立配置文件：

```
Vue CLI v4.5.10
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, Linter, Unit
? Choose a version of Vue.js that you want to start the project with 3.x (Preview)
? Pick a linter / formatter config: Basic
? Pick additional lint features: Lint on save   
? Pick a unit testing solution: Jest
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
> In dedicated config files
  In package.json
```

输入n，Enter确认，表示不将此次配置作为后续项目的默认配置

```
Vue CLI v4.5.10
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, Linter, Unit
? Choose a version of Vue.js that you want to start the project with 3.x (Preview)
? Pick a linter / formatter config: Basic
? Pick additional lint features: Lint on save   
? Pick a unit testing solution: Jest
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N) n
```



项目创建完成后，部分文件的配置信息如下：

`babel.config.js`:

``` js
module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ]
}

```

`jest.config.js`， 这个文件的配置默认是预设插件的，可以按实际需求改成上面提到的配置 `Jest` 里的配置一样。

``` js
module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  }
}
```

`package.json`:

``` json
{
  "name": "vue-jest-demo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "test:unit": "vue-cli-service test:unit",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^3.6.5",
    "vue": "^3.0.0"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-eslint": "~4.5.0",
    "@vue/cli-plugin-unit-jest": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "@vue/compiler-sfc": "^3.0.0",
    "@vue/test-utils": "^2.0.0-0",
    "babel-eslint": "^10.1.0",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^7.0.0-0",
    "typescript": "~3.9.3",
    "vue-jest": "^5.0.0-0"
  }
}
```

### 执行测试命令

新建的项目默认自带测试demo，执行测试

``` 
cd vue-jest-demo
npm run test:unit
```

命令行终端可以查看到测试结果

```
D:\work\songwang\test-demo\vue-jest-demo>npm run test:unit

> vue-jest-demo@0.1.0 test:unit D:\work\songwang\test-demo\vue-jest-demo
> vue-cli-service test:unit

 PASS  tests/unit/example.spec.js
  HelloWorld.vue
    √ renders props.msg when passed (26ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.283s
Ran all test suites.
```



### 配置测试覆盖率

测试用例写了部分，如果我们看下覆盖率如何，就需要要配置测试覆盖率。在 `jest.config.js` 里新增配置：

``` JS
collectCoverage: true,
collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],
```

在 `package.json` 的 `scripts` 中新增一条配置:

```
"test:cov": "vue-cli-service test:unit --coverage"
```

然后我们在终端运行： `npm run test:cov`，结果如下：

```
D:\work\songwang\test-demo\vue-jest-demo>npm run test:cov

> vue-jest-demo@0.1.0 test:cov D:\work\songwang\test-demo\vue-jest-demo
> vue-cli-service test:unit --coverage

 PASS  tests/unit/example.spec.js
  HelloWorld.vue
    √ renders props.msg when passed (28ms)

------------------------------------|----------|----------|----------|----------|-------------------|
File                                |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
------------------------------------|----------|----------|----------|----------|-------------------|
All files                           |     0.15 |        0 |        0 |     0.89 |                   |
 vue-jest-demo                      |        0 |      100 |      100 |        0 |                   |
  babel.config.js                   |        0 |      100 |      100 |        0 |                 1 |
  jest.config.js                    |        0 |      100 |      100 |        0 |                 1 |
 vue-jest-demo/coverage/lcov-report |        0 |        0 |        0 |        0 |                   |
  block-navigation.js               |        0 |        0 |        0 |        0 |... 69,70,74,75,79 |
  prettify.js                       |        0 |        0 |        0 |        0 |                 2 |
  sorter.js                         |        0 |        0 |        0 |        0 |... 64,165,166,170 |
 vue-jest-demo/src                  |        0 |      100 |      100 |        0 |                   |
  App.vue                           |        0 |      100 |      100 |        0 |               7,9 |
  main.js                           |        0 |      100 |      100 |        0 |                 4 |
 vue-jest-demo/src/components       |      100 |      100 |      100 |      100 |                   |
  HelloWorld.vue                    |      100 |      100 |      100 |      100 |                   |
------------------------------------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        8.874s
Ran all test suites.
```

 `coverage` 目录，浏览器打开里面的 `index.html` 查看覆盖率信息。

 ### 示例工程
https://github.com/lmiller1990/vue-testing-handbook


