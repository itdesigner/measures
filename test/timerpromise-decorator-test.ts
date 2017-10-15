import {assert} from 'chai';
import {timerpromise} from '../src/decorators';
import {ILogOptions, IMeasureMessage, IMeasureOptions, LogLevel, MeasureType} from '../src/shared';
import {MockSink} from './mock-sink';
import {instanceOfLogMessage, instanceOfMeasureMessage} from './utilities';

const loglevelFx = (): LogLevel => {
    return LogLevel.DEBUG;
};
const s = new MockSink();
const lo: ILogOptions = {
    logLevel: LogLevel.INFO,
    args: true,
    results: false,
    tags: [
        'tag1',
        {test: 'tag'},
    ],
};
const lo2: ILogOptions = {
    logLevel: loglevelFx,
    args: true,
    results: false,
    tags: [
        'tag1',
        {test: 'tag'},
    ],
};

const o: IMeasureOptions = {
    log: lo,
};
const o2: IMeasureOptions = {
    log: lo2,
};
class TestClass {
    @timerpromise('deco-timer', o, new Array(s))
    public testMethod(c: number) {
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
    @timerpromise('deco-timer2', o, new Array(s))
    public testMethod2(c: number) {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < c; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @timerpromise('deco-timer3', undefined, new Array(s))
    public testMethod3() {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < 10000000; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @timerpromise(undefined, undefined, new Array(s))
    public testMethod4() {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < 10000000; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @timerpromise('deco-timer5', o2, new Array(s))
    public testMethod5() {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < 10000000; i++) {
                k += i;
            }
            resolve(k);
        });
    }
    @timerpromise('deco-timer6', {}, new Array(s))
    public testMethod6() {
        return new Promise((resolve, reject) => {
            let k: number = 0;
            for (let i: number = 0; i < 1000000; i++) {
                k += i;
            }
            if (k > 49999995000000) {
                resolve(k);
            } else {
                reject('a bad error');
            }
        });
    }
}

describe('Timer Promise Decorator', function() {
    it('default timer against a method', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.testMethod3().then((val) => {
            assert.equal(s.messageCount, 1, 'invalid number of messages');
            const mm = (s.sinkData.pop()) as IMeasureMessage;
            assert.equal(mm.type, MeasureType.Timer, 'incorrect Measure type - expecting timer');
            assert.isAbove(mm.value, 0, 'timer should have recorded a value');
            assert.equal(mm.name, 'deco-timer3', 'should have used specified name');
        });
    });
    it('default timer against a method with no timer name', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.testMethod4().then((val) => {
            assert.equal(s.messageCount, 1, 'invalid number of messages');
            const mm = (s.sinkData.pop()) as IMeasureMessage;
            assert.equal(mm.type, MeasureType.Timer, 'incorrect Measure type - expecting timer');
            assert.isAbove(mm.value, 0, 'timer should have recorded a value');
            assert.equal(mm.name, 'TestClass.testMethod4', 'should have defaulted a name');
        });
    });
    it('default timer against a method with a log level function', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.testMethod5().then((val) => {
            assert.equal(s.messageCount, 2, 'invalid number of messages');
            for (let i = 0, len = s._sinkData.length; i < len; i++) {
                const m = s._sinkData[i];
                if (instanceOfMeasureMessage(m)) {
                    assert.equal(m.type, MeasureType.Timer, 'incorrect Measure type - expecting timer');
                } else if (instanceOfLogMessage(m)) {
                    assert.equal(m.level, LogLevel.DEBUG, 'incorrect Log level- expecting INFO');
                    assert.equal(m.name, 'deco-timer5', 'incorrect log name');
                }
            }
        });
    });
    it('timer against a void method with additional logging enabled', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        try {
            tc.testMethod2(10000000).then((val) => {
                assert.equal(s.messageCount, 2, 'invalid number of messages');
                for (let i = 0, len = s._sinkData.length; i < len; i++) {
                    const m = s._sinkData[i];
                    if (instanceOfMeasureMessage(m)) {
                        assert.equal(m.type, MeasureType.Timer, 'incorrect Measure type - expecting timer');
                    } else if (instanceOfLogMessage(m)) {
                        assert.equal(m.level, LogLevel.INFO, 'incorrect Log level- expecting INFO');
                        assert.equal(m.name, 'deco-timer2', 'incorrect log name');
                        assert.isTrue(Array.isArray(m.args), 'incorrect arguments - should be an array');
                        if (m.args && m.args.length > 0) {
                            assert.equal(m.args[0], '10000000', 'invalid argument value');
                        }
                    }
                }
            });
        } catch (ex) {
            // don't care
        }
    });
    it('timer against a method that throws exception and doesnt log', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.testMethod6()
        .catch((ex) => {
            assert.equal(s.messageCount, 1, 'invalid number of messages');
            for (let i = 0, len = s._sinkData.length; i < len; i++) {
                const m = s._sinkData[i];
                if (instanceOfMeasureMessage(m)) {
                    assert.equal(m.type, MeasureType.Timer, 'incorrect Measure type - expecting timer');
                }
            }
        });
    });
    it('timer against a method with logging enabled that throws an error', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.testMethod(10000000)
        .catch((ex) => {
            assert.equal(s.messageCount, 2, 'invalid number of messages');
            for (let i = 0, len = s._sinkData.length; i < len; i++) {
                const m = s._sinkData[i];
                if (instanceOfMeasureMessage(m)) {
                    assert.equal(m.type, MeasureType.Timer, 'incorrect Measure type - expecting timer');
                } else if (instanceOfLogMessage(m)) {
                    assert.equal(m.level, LogLevel.ERROR, 'incorrect Log level- expecting INFO');
                    assert.equal(m.name, 'deco-timer', 'incorrect log name');
                    assert.isTrue(Array.isArray(m.args), 'incorrect arguments - should be an array');
                    if (m.args && m.args.length > 0) {
                        assert.equal(m.args[0], '10000000', 'invalid argument value');
                    }
                    assert.equal(m.error, 'a bad error', 'should have logged an error');
                }
            }
        });
    });
});
