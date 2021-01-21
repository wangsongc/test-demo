## 测试ts
### 安装jest
```
npm install --save-dev jest typescript ts-jest ts-node babel-jest @babel/core @babel/preset-env
```
### 生成jest,ts配置文件
```
jest --init
tsc --init
```

### 创建 sum.ts
./src/sum.ts
```typescript
export function sum(a: number, b: number){
    return a + b;
}
```
### 编写测试用例
./src/sum.test.ts
```typescript
import {sum} from '../src/sum'

test('test sum', ()=>{
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