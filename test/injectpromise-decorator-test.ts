import {assert} from 'chai';
import {injectpromise, IPostInjectFunction, IPreInjectFunction } from '../src/decorators';

const pre: IPreInjectFunction = (name: string, ...args: any[]): any[] => {
    const results: any[] = new Array();
    // we are going to double the parameters before returning them
    for (const item of args) {
        results.push(item * 2);
    }
    return results;
};
const post: IPostInjectFunction = (name: string, args: any): any => {
    // lets upperCase any answers
    const results: any = JSON.stringify(args).toUpperCase();
    return results;
};

class TestClass {
    @injectpromise('injector', pre, post)
    public testMethod(c: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i > 10) {
                resolve('number is ' + c);
            } else {
                reject('invalid');
            }
        });
    }
    @injectpromise('injector2', pre, post)
    public testMethod2(c: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + c);
            } else {
                reject('invalid');
            }
        });
    }
    @injectpromise(undefined, pre, post)
    public testMethod3(c: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + c);
            } else {
                reject('invalid');
            }
        });
    }
    @injectpromise('injector4', undefined, post)
    public testMethod4(c: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + c);
            } else {
                reject('invalid');
            }
        });
    }
    @injectpromise('injector5', pre)
    public testMethod5(c: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + c);
            } else {
                reject('invalid');
            }
        });
    }
    @injectpromise('injector', pre, post)
    public testMethod6(c: number) {
        return new Promise((resolve, reject) => {
            let i: number = 10;
            i++;
        });
    }
}

describe('Injection Promise Decorator', function() {
    it('default injector against method (both pre and post)', function() {
        const tc: TestClass = new TestClass();
        tc.testMethod2(1000).then((r) => {
            assert.equal(r, '\"NUMBER IS 2000\"');
        });
    });
    it('default injector against method (no name and both pre and post)', function() {
        const tc: TestClass = new TestClass();
        tc.testMethod3(1000).then((r) => {
            assert.equal(r, '\"NUMBER IS 2000\"');
        });
    });
    it('default injector against method (post only)', function() {
        const tc: TestClass = new TestClass();
        tc.testMethod4(1000).then((r) => {
            assert.equal(r, '\"NUMBER IS 2000\"');
        });
    });
    it('default injector against method (pre only)', function() {
        const tc: TestClass = new TestClass();
        tc.testMethod5(1000).then((r) => {
            assert.equal(r, '\"NUMBER IS 2000\"');
        });
    });
    it('default injector against method that throws an error', function() {
        const tc: TestClass = new TestClass();
        tc.testMethod(1000).then((r) => {
            assert.equal(r, '\"NUMBER IS 2000\"');
        }).catch((err) => {
            assert.equal(err, 'invalid');
        });
    });
});
