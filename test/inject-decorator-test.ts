import {assert} from 'chai';
import {inject, IPostInjectFunction, IPreInjectFunction } from '../src/decorators';

const pre: IPreInjectFunction = (name: string, ...args: any[]): any[] => {
    const results: any[] = new Array();
    // we are going to double the parameters before returning them
    for (const arg of args) {
        results.push(arg * 2);
    }
    return results;
};
const post: IPostInjectFunction = (name: string, args: any): any => {
    // lets upperCase any answers
    const results: any = JSON.stringify(args).toUpperCase();
    return results;
};

class TestClass {
    @inject('injector', pre, post)
    public testMethod(c: number): string {
        throw Error('a bad error');
    }
    @inject('injector2', pre, post)
    public testMethod2(c: number): string {
        return 'number is ' + c;
    }
    @inject(undefined, pre, post)
    public testMethod3(c: number): string {
        return 'number is ' + c;
    }
    @inject('injector4', undefined, post)
    public testMethod4(c: number): string {
        return 'number is ' + c;
    }
    @inject('injector5', pre)
    public testMethod5(c: number): string {
        return 'number is ' + c;
    }
}

describe('Injection Decorator', function() {
    it('default injector against method (both pre and post)', function() {
        const tc: TestClass = new TestClass();
        const r = tc.testMethod2(1000);
        assert.equal(r, '\"NUMBER IS 2000\"');
    });
    it('default injector against method (no name and both pre and post)', function() {
        const tc: TestClass = new TestClass();
        const r = tc.testMethod3(1000);
        assert.equal(r, '\"NUMBER IS 2000\"');
    });
    it('default injector against method (post only)', function() {
        const tc: TestClass = new TestClass();
        const r = tc.testMethod4(1000);
        assert.equal(r, '\"NUMBER IS 1000\"');
    });
    it('default injector against method (pre only)', function() {
        const tc: TestClass = new TestClass();
        const r = tc.testMethod5(1000);
        assert.equal(r, 'number is 2000');
    });
    it('default injector against method that throws an error', function() {
        const tc: TestClass = new TestClass();
        let e: Error = new Error();
        try {
            tc.testMethod(1000);
        } catch (ex) {
            e = ex;
        }
        assert.equal(e.message, 'a bad error');
    });
});
