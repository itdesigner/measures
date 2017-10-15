import {assert} from 'chai';
import {logpromise, logpromiseCritical, logpromiseDebug, logpromiseError, logpromiseInfo, logpromiseVerbose, logpromiseWarning} from '../src/decorators';
import {ILogMessage, ILogOptions, LogLevel} from '../src/shared';
import {MockSink} from './mock-sink';

const loglevelFx = (): LogLevel => {
    return LogLevel.DEBUG;
};
const s = new MockSink();
const lo: ILogOptions = {
    args: true,
    results: true,
    tags: [
        'tag1',
        {test: 'tag'},
    ],
};
const lo2: ILogOptions = {
    logLevel: loglevelFx,
    args: true,
    results: true,
    tags: [
        'tag1',
        {test: 'tag'},
    ],
};

class TestClass {
    @logpromise(undefined, new Array(s))
    public method1(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @logpromise(lo, new Array(s))
    public method2(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            if (k > 49999995000000) {
                resolve(k);
            } else {
                reject('a bad error');
            }
        });
    }
    @logpromiseVerbose(lo, new Array(s))
    public method3(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @logpromiseDebug(lo, new Array(s))
    public method4(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @logpromiseInfo(lo, new Array(s))
    public method5(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @logpromiseWarning(lo, new Array(s))
    public method6(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @logpromiseError(lo, new Array(s))
    public method7(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @logpromiseCritical(lo, new Array(s))
    public method8(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @logpromise(lo2, new Array(s))
    public method9(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
}

describe('log promise decorators', function() {
    it('default logger', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method1(10000000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method1', 'incorrect default name');
            assert.equal(m.level, LogLevel.INFO, 'incorrect default level');
            assert.equal(m.results, 49999995000000, 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
    it('default logger with loglevel function', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method9(10000000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method9', 'incorrect default name');
            assert.equal(m.level, LogLevel.DEBUG, 'incorrect default level');
            assert.equal(m.results, 49999995000000, 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
    it('default logger that throws error', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method2(10000000).catch((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method2', 'incorrect default name');
            assert.equal(m.level, LogLevel.ERROR, 'incorrect default level');
            assert.equal(m.error, 'a bad error', 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
    it('default log Verbose', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method3(10000000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method3', 'incorrect default name');
            assert.equal(m.level, LogLevel.VERBOSE, 'incorrect default level');
            assert.equal(m.results, 49999995000000, 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
    it('default log Debug', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method4(10000000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method4', 'incorrect default name');
            assert.equal(m.level, LogLevel.DEBUG, 'incorrect default level');
            assert.equal(m.results, 49999995000000, 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
    it('default log Info', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method5(10000000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method5', 'incorrect default name');
            assert.equal(m.level, LogLevel.INFO, 'incorrect default level');
            assert.equal(m.results, 49999995000000, 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
    it('default log Warning', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method6(10000000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method6', 'incorrect default name');
            assert.equal(m.level, LogLevel.WARNING, 'incorrect default level');
            assert.equal(m.results, 49999995000000, 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
    it('default log Error', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method7(10000000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method7', 'incorrect default name');
            assert.equal(m.level, LogLevel.ERROR, 'incorrect default level');
            assert.equal(m.results, 49999995000000, 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
    it('default log Critical', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.method8(10000000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only b one log message');
            const m = s._sinkData.pop() as ILogMessage;
            assert.equal(m.name, 'TestClass.method8', 'incorrect default name');
            assert.equal(m.level, LogLevel.CRITICAL, 'incorrect default level');
            assert.equal(m.results, 49999995000000, 'incorrect results logged');
            assert.isTrue(Array.isArray(m.args), 'args should be an array');
        });
    });
});
