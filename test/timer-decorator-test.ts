import {assert} from 'chai';
import {timer} from '../src/decorators';
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
    @timer('deco-timer0', undefined, new Array(s))
    public testMethod0(c: number) {
        let k: number = 0;
        for (let i: number = 0; i < c; i++) {
            k += i;
        }
        throw Error('a bad error');
    }
    @timer('deco-timer', o, new Array(s))
    public testMethod(c: number) {
        let k: number = 0;
        for (let i: number = 0; i < c; i++) {
            k += i;
        }
        throw Error('a bad error');
    }
    @timer('deco-timer2', o, new Array(s))
    public testMethod2(c: number): number {
        let k: number = 0;
        for (let i: number = 0; i < c; i++) {
            k += i;
        }
        return k;
    }
    @timer('deco-timer3', undefined, new Array(s))
    public testMethod3(): void {
        let k: number = 0;
        for (let i: number = 0; i < 10000000; i++) {
            k += i;
        }
    }
    @timer(undefined, undefined, new Array(s))
    public testMethod4(): void {
        let k: number = 0;
        for (let i: number = 0; i < 10000000; i++) {
            k += i;
        }
    }
    @timer('deco-timer5', o2, new Array(s))
    public testMethod5(): void {
        let k: number = 0;
        for (let i: number = 0; i < 10000000; i++) {
            k += i;
        }
    }
}

describe('Timer Decorator', function() {
    it('default timer against a void method', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.testMethod3();
        assert.equal(s.messageCount, 1, 'invalid number of messages');
        const mm = (s.sinkData.pop()) as IMeasureMessage;
        assert.equal(mm.type, MeasureType.Timer, 'incorrect Measure type - expecting timer');
        assert.isAbove(mm.value, 0, 'timer should have recorded a value');
        assert.equal(mm.name, 'deco-timer3', 'should have used specified name');
    });
    it('default timer against a method with no timer name', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.testMethod4();
        assert.equal(s.messageCount, 1, 'invalid number of messages');
        const mm = (s.sinkData.pop()) as IMeasureMessage;
        assert.equal(mm.type, MeasureType.Timer, 'incorrect Measure type - expecting timer');
        assert.isAbove(mm.value, 0, 'timer should have recorded a value');
        assert.equal(mm.name, 'TestClass.testMethod4', 'should have defaulted a name');

    });
    it('default timer against a method with a log level function', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        tc.testMethod5();
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
    it('timer against a void method with additional logging enabled', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        try {
            tc.testMethod2(10000000);
        } catch (ex) {
            // don't care
        }

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
    it('timer against a method with logging enabled that throws an error', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        try {
            tc.testMethod(10000000);
        } catch (ex) {
            // don't care
        }
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
                const e: Error = m.error as Error;
                assert.equal(e.message, 'a bad error', 'should have logged an error');
            }
        }
    });
    it('timer against a method with no logging enabled that throws an error', function() {
        s._sinkData = [];
        s.messageCount = 0;
        const tc: TestClass = new TestClass();
        try {
            tc.testMethod0(10000000);
        } catch (ex) {
            // don't care
        }
        assert.equal(s.messageCount, 1, 'invalid number of messages');
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
                const e: Error = m.error as Error;
                assert.equal(e.message, 'a bad error', 'should have logged an error');
            }
        }
    });
});
