## 测试js
### 安装jest
```
npm install --save-dev jest
```
### 生成jest配置文件jest.config.js
```
jest --init
```

### 创建 sum.ts
./src/sum.js
```javascript
function sum(a, b){
    return a + b;
}

module.exports = sum;
```
### 编写测试用例
./src/sum.test.js
```javascript
sum = require('../src/sum')

test('sum test', ()=>{
    expect(sum(1,2)).toBe(3);
})
```
### 执行测试
```
npx jest
```
or
```
npm test
```