//问题:一旦fetchData完成，测试也就执行完成，然后再调用回调(callback是否被调用无法判断)
function fetchData(callback) {
    let data = 'peanut butter'
    setTimeout(callback(data), 3000)
}
test('the data is peanut butter', () => {
    function callback(data) {
        expect(data).toBe('peanut butter');
    }

    fetchData(callback);
});

//Callbacks
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
//Promises

function division(a, b) {
    return new Promise(function (resolve, reject) {
        if (b == 0){
            reject("Diveide zero");
        } else {
            resolve(a / b);
        }
    }).then(function (value) {
        return value
    }).catch(function (err) {  //如果被测代码中已经catch，则在测试中可能获取不到错误信息
        throw new Error(err+'!')
    }).finally(function () {
        return value = 'end'
        //console.log("End");
    });
}

describe('then/catch', () => {
    test('the data is peanut butter', () => {
        let a = 1;
        let b = 2;
        expect.assertions(1);
        return division(a, b).then(data => {
            expect(data).toBe(0.5);
        });
    });

    test('the fetch fails with an error', () => {
        let a = 1;
        let b = 0;
        expect.assertions(1);
        return division(a, b).catch(err => expect(err.message).toBe('Diveide zero!'));
    });
})


describe('resolves/rejects', () => {
    test('the data is peanut butter', () => {
        let a = 1;
        let b = 2;
        return expect(division(a, b)).resolves.toBe(0.5);
    });

    test('the fetch fails with an error', () => {
        let a = 1;
        let b = 0;
        return expect(division(a, b)).rejects.toStrictEqual(new Error('Diveide zero!'));
    });
})

//Async/Await
describe('Async/Await', () => {
    test('the data is peanut butter', async () => {
        let a = 1;
        let b = 2;
        const data = await division(a, b);
        expect(data).toBe(0.5);
    });
//源码中err被catch
    // test('the fetch fails with an error', async () => {
    //     let a = 1;
    //     let b = 0;
    //     expect.assertions(1);
    //     try {
    //         await division(a, b);
    //     } catch (e) {
    //         expect(e).toMatch('Diveide zero');
    //     }
    // });
})

describe('Async/Await+resolves/rejects', () => {
    test('the data is peanut butter', async () => {
        let a = 1;
        let b = 2;
        await expect(division(a, b)).resolves.toBe(0.5);
    });

    test('the fetch fails with an error', async () => {
        let a = 1;
        let b = 0;
        expect.assertions(1);
        await expect(division(a, b)).rejects.toThrow('Diveide zero!');
    });

})