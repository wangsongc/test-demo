import axios from 'axios';
import Users from '../src/users';

//mock模块
jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});

//mock实现
// foo is a mock function
jest.mock('../src/foo'); // this happens automatically with automocking
const foo = require('../src/foo');

// foo is a mock function
foo.mockImplementation(() => 42);
test('mockImplementation',()=>{
    expect(foo()).toBe(42)
})

//利用mockImplementationOnce等可以使每次调用产生预期的值
{
    const myMockFn = jest
    .fn(() => 'default')
    .mockImplementationOnce(() => 'first call')
    .mockImplementationOnce(() => 'second call');
  
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
  // > 'first call', 'second call', 'default', 'default'
}