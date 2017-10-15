import {assert} from 'chai';
import {APM} from '../src/APM';
import {measurepromise } from '../src/decorators';

import {IMeasureMessage, MeasureType} from '../src/shared';
import {MockSink} from './mock-sink';

const gfx = () => 10;
const hfx = () => true;
const s = new MockSink();
const apm = new APM(new Array(s));
const c = apm.countOperation('counter');
const g = apm.gaugeOperation('gauge', gfx);
const h = apm.healthOperation('health', hfx);
const m = apm.meterOperation('meter');
const t = apm.timeOperation('timer');



class TestClass {
    @measurepromise(c)
    public testMethod(k: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i > 10) {
                resolve('number is ' + k);
            } else {
                reject('invalid');
            }
        });
    }
    @measurepromise(c)
    public testMethod2(k: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + k);
            } else {
                reject('invalid');
            }
        });
    }
    @measurepromise(g)
    public testMethod3(k: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + k);
            } else {
                reject('invalid');
            }
        });
    }
    @measurepromise(h)
    public testMethod4(k: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + k);
            } else {
                reject('invalid');
            }
        });
    }
    @measurepromise(m)
    public testMethod5(k: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + k);
            } else {
                reject('invalid');
            }
        });
    }
    @measurepromise(t)
    public testMethod6(k: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i === 10) {
                resolve('number is ' + k);
            } else {
                reject('invalid');
            }
        });
    }
    @measurepromise(c)
    public testMethod7(k: number) {
        return new Promise((resolve, reject) => {
            const i: number = 10;
            if (i > 10) {
                resolve('number is ' + k);
            } else {
                throw Error('a bad thing');
            }
        });
    }
}

describe('Measure Promise Decorator', function() {
    it('default measure against method (counter)', function() {
        const tc: TestClass = new TestClass();
        tc.testMethod2(1000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only be once meaure logged');
            const l = s.sinkData.pop() as IMeasureMessage;
            assert.equal(l.name, 'counter', 'invalid counter name');
            assert.equal(l.type, MeasureType.Counter, 'invalid type');
            assert.equal(l.value, 1, 'incorrect value');
        });
    });
    it('default measure against method (gauge)', function() {
        s.messageCount = 0;
        s._sinkData = [];
        const tc: TestClass = new TestClass();
        tc.testMethod3(1000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only be once meaure logged');
            const l = s.sinkData.pop() as IMeasureMessage;
            assert.equal(l.name, 'gauge', 'invalid gauge name');
            assert.equal(l.type, MeasureType.Gauge, 'invalid type');
            assert.equal(l.value, 10, 'incorrect value');
        });
    });
    it('default measure against method (health)', function() {
        s.messageCount = 0;
        s._sinkData = [];
        const tc: TestClass = new TestClass();
        tc.testMethod4(1000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only be once meaure logged');
            const l = s.sinkData.pop() as IMeasureMessage;
            assert.equal(l.name, 'health', 'invalid health name');
            assert.equal(l.type, MeasureType.Health, 'invalid type');
            assert.equal(l.value, true, 'incorrect value');
        });
    });
    it('default measure against method (meter)', function() {
        s.messageCount = 0;
        s._sinkData = [];
        const tc: TestClass = new TestClass();
        for (let i: number = 0; i < 1000; i++) {
            tc.testMethod5(1000).then((r) => {
                // really dont care
            }).catch((err) => {
                // really dont care
            });
        }
        assert.equal(m.count, 1000, 'should be 1000 count value');
        m.write();
        assert.equal(s.messageCount, 1, 'should only be once meaure logged');
        const l = s.sinkData.pop() as IMeasureMessage;
        assert.equal(l.name, 'meter', 'invalid meter name');
        assert.equal(l.type, MeasureType.Meter, 'invalid type');
        const v = l.value;
        assert.equal(v.count, 1000, 'incorrect value count');
        assert.isAbove(parseInt(v.mean, 10), 0, 'incorrect value mean');
    });
    it('default measure against method (timer)', function() {
        s.messageCount = 0;
        s._sinkData = [];
        const tc: TestClass = new TestClass();
        tc.testMethod6(1000).then((r) => {
            assert.equal(s.messageCount, 1, 'should only be once meaure logged');
            const l = s.sinkData.pop() as IMeasureMessage;
            assert.equal(l.name, 'timer', 'invalid timer name');
            assert.equal(l.type, MeasureType.Timer, 'invalid type');
            assert.isAbove(l.value, 0, 'incorrect value');
        });
    });
    it('default measure against method that throws an reject(counter)', function() {
        const tc: TestClass = new TestClass();
        let e: string = '';
        tc.testMethod(1000)
        .catch((ex) => {
            e = ex;
            assert.equal(e, 'invalid');
        });
    });
});
