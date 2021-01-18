//mock函数
function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
      callback(items[index]);
    }
  }

it('mock function callback,and test function forEach',()=>{
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
})

//`.mock` 属性
/*
所有模拟函数都具有此特殊`.mock`属性，该属性用于保存有关如何调用函数以及返回的函数的数据。
该`.mock`属性还跟踪`this`每个调用的值，因此也可以检查此值
*/
{
const myMock = jest.fn();

const a = new myMock();
const b = {};
const bound = myMock.bind(b);
bound();

console.log(myMock.mock.instances);
// > [ <a>, <b> ]
}

//mock返回值
{
const myMock = jest.fn();
console.log(myMock());
// > undefined

//第一次调用时返回10，第二次调用时返回x，之后的调用全部返回true
myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true
}

{
const filterTestFn = jest.fn();

// Make the mock return `true` for the first call,
// and `false` for the second call
filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

const result = [11, 12].filter(num => filterTestFn(num));

console.log(result);
// > [11]
console.log(filterTestFn.mock.calls[0][0]); // 11
console.log(filterTestFn.mock.calls[0][1]); // 12
}

//mock模块,见user.test.js

//mock实现,见user.test.js

//mock名称
//为模拟函数提供一个名称，该名称将在测试错误输出中显示，而不是显示“ jest.fn（）”。
//如果您希望能够快速识别在测试输出中报告错误的模拟功能，请使用此功能
{
const myMockFn = jest
  .fn()
  .mockReturnValue('default')
  .mockImplementation(scalar => 42 + scalar)
  .mockName('add42');
}

