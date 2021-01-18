let cities = []
function initializeCityDatabase() {
    cities = ['wuhan', 'changsha']
}

function clearCityDatabase() {
    cities = []
}

function isCity(city) {
    for (item in cities) {
        if (cities[item] == city) {
            return true
        }
    }
    return false
}

//测试
beforeEach(() => {
    initializeCityDatabase();
});

afterEach(() => {
    clearCityDatabase();
});

//test.only可以指定仅运行哪个用例，方便定位和修复问题
test.only('city database has wuhan', () => {
    expect(isCity('wuhan')).toBeTruthy();
});

test('city database has changsha', () => {
    expect(isCity('changsha')).toBeTruthy();
});


//测试钩子函数的执行顺序，顶层`beforeEach`是`beforeEach`在`describe`块内部之前执行的
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