
import {assert} from 'chai';
import {Counter, ICounterMeasure } from '../src/measures';
import {IMeasureOptions} from '../src/shared';
import {ISink} from '../src/sinks';
import {MockSink} from './mock-sink';
import {contains, sinkIsArray, sinkIsFunction} from './utilities';

function getCounter(): ICounterMeasure {
    const c = new Counter('test-counter', getMockSink(), getTestOptions());
    return c;
}

function getTestOptions(): IMeasureOptions {
    const my_options = {
        correlationId: 'abc',
        uom: 'click(s)',
        resolution: 10,
        directWrite: true,
    };
    return my_options;
}

function getMockSink(): ISink[] {
    return new Array(new MockSink());
}

const functionSinkItems: any[] = [];

function functionSink(item: any) {
    functionSinkItems.push(item);
}

describe('counters', function() {
    describe('counter constructors', function() {
        const ctor = Counter as any;
        it('create a default counter with only a name and mocksink', function() {
            const c = new Counter('test-counter', getMockSink());
            assert.exists(c, 'counter does not exist (null or undefined)');
            assert.equal(c.name, 'test-counter', 'incorrect counter name');
            assert.equal(c.type, 1, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrect default unit of measure');
            assert.equal(c.directWrite, true, 'incorrect default directwrite property');
            assert.equal(c.resolution, 1, 'incorrect default resolution');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
        });
        it('create a default counter with only a name and sink function', function() {
            const c = new Counter('test-counter', functionSink);
            assert.exists(c, 'counter does not exist (null or undefined)');
            assert.equal(c.name, 'test-counter', 'incorrect counter name');
            assert.equal(c.type, 1, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrect default unit of measure');
            assert.equal(c.directWrite, true, 'incorrect default directwrite property');
            assert.equal(c.resolution, 1, 'incorrect default resolution');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsFunction(c.sinks), 'sink should be a function');
        });

        it('create a counter with MeasureOptions', function() {
            const c = new Counter('test-counter', getMockSink(), getTestOptions());
            assert.exists(c, 'counter does not exist (null or undefined)');
            assert.equal(c.name, 'test-counter', 'incorrect counter name');
            assert.equal(c.type, 1, 'incorrect measure type');
            assert.equal(c.uom, 'click(s)', 'incorrect unit of measure');
            assert.equal(c.directWrite, true, 'incorrect directwrite property');
            assert.equal(c.resolution, 10, 'incorrect resolution');
            assert.equal(c.correlationId, 'abc', 'incorrect correlation id');
        });
        it('create a counter with empty MeasureOptions', function() {
            const c = new Counter('test-counter', getMockSink(), {});
            assert.exists(c, 'counter does not exist (null or undefined)');
            assert.equal(c.name, 'test-counter', 'incorrect counter name');
            assert.equal(c.type, 1, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrect unit of measure');
            assert.equal(c.directWrite, true, 'incorrect directwrite property');
            assert.equal(c.resolution, 1, 'incorrect resolution');
            assert.equal(c.correlationId, '', 'incorrect correlation id');
        });
        it('prevent create a counter with no name', function() {
            assert.throws(() => new ctor(), /Invalid arguments: name is required/, 'counter should throw exception');
        });
        it('prevent create a counter with no sink', function() {
            assert.throws(() => new ctor('test-counter'), /Invalid arguments: sinks are required/, 'counter should throw exception');
        });
    });
    describe('counter functionality', function() {
        it('validate a counter default increment', function() {
            const c = getCounter();
            c.increment();
            assert.equal(c.count, 1, 'incorrect default increment value');
        });
        it('validate a counter multiple value increment', function() {
            const c = getCounter();
            c.increment(10);
            assert.equal(c.count, 10, 'incorrect counter value');
        });
        it('validate a counter value (negative) increment limited to zero', function() {
            const c = getCounter();
            c.increment(-1);
            assert.equal(c.count, 0, 'incorrect counter lower limit value');
        });
        it('validate a counter default decrement', function() {
            const c = getCounter();
            c.increment(10);
            c.decrement();
            assert.equal(c.count, 9, 'incorrect default decrement value');
        });
        it('validate a counter multiple value decrement', function() {
            const c = getCounter();
            c.increment(20);
            c.decrement(10);
            assert.equal(c.count, 10, 'incorrect counter value');
        });
        it('validate a counter value deecrement limited to zero', function() {
            const c = getCounter();
            c.increment();
            c.decrement(10);
            assert.equal(c.count, 0, 'incorrect counter lower limit value');
        });
        it('validate a counter value (negative) decrement limited to zero', function() {
            const c = getCounter();
            c.decrement(-1);
            assert.equal(c.count, 1, 'incorrect counter lower limit value');
        });
        it('validate roll over when max value exceeded', function() {
            const max = Math.pow(2, 32);
            const c = getCounter();
            c.increment(max);
            assert.equal(c.count, max, 'not at the max threshhold');
            c.increment(1);
            assert.equal(c.count, 0, 'should have rolled over');
        });
        it('validate counter reset', function() {
            const c = getCounter();
            c.increment(10);
            assert.equal(c.count, 10, 'incorrect value set');
            c.reset();
            assert.equal(c.count, 0, 'reset did not set value to 0');
        });
        it('validate counter simple write resolution one', function() {
            const ms = new MockSink();
            const c = new Counter('test-counter', new Array(ms));
            for (let i = 0; i < 10; i++) {
                c.increment();
            }
            assert.equal(ms._sinkData.length, 10, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            assert.equal(r.name, 'test-counter', 'counter name does match');
            assert.equal(r.type, 1, 'counter type does match');
            assert.equal(r.uom, 'operation(s)', 'counter uom does match');
            assert.equal(r.value, 10, 'counter value does match');
            assert.equal(r.correlationId, '', 'counter correlation does match');
        });
        it('validate counter simple write resolution one to sink function', function() {
            const c = new Counter('test-counter', functionSink);
            for (let i = 0; i < 10; i++) {
                c.increment();
            }
            assert.equal(functionSinkItems.length, 10, 'incorrect number of measures in the sink');
            const r = functionSinkItems.pop();
            assert.equal(r.name, 'test-counter', 'counter name does match');
            assert.equal(r.type, 1, 'counter type does match');
            assert.equal(r.uom, 'operation(s)', 'counter uom does match');
            assert.equal(r.value, 10, 'counter value does match');
            assert.equal(r.correlationId, '', 'counter correlation does match');
        });
        it('validate counter decrements write with resolution one', function() {
            const ms = new MockSink();
            const c = new Counter('test-counter', new Array(ms));
            c.increment(10);
            for (let i = 0; i < 10; i++) {
                c.decrement();
            }
            assert.equal(ms._sinkData.length, 11, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            assert.equal(r.name, 'test-counter', 'counter name does match');
            assert.equal(r.type, 1, 'counter type does match');
            assert.equal(r.uom, 'operation(s)', 'counter uom does match');
            assert.equal(r.value, 0, 'counter value does match');
            assert.equal(r.correlationId, '', 'counter correlation does match');
        });
        it('validate counter resets write with resolution one', function() {
            const ms = new MockSink();
            const c = new Counter('test-counter', new Array(ms));
            for (let i = 0; i < 10; i++) {
                c.increment();
            }
            c.reset();
            assert.equal(ms._sinkData.length, 11, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            assert.equal(r.name, 'test-counter', 'counter name does match');
            assert.equal(r.type, 1, 'counter type does match');
            assert.equal(r.uom, 'operation(s)', 'counter uom does match');
            assert.equal(r.value, 0, 'counter value does match');
            assert.equal(r.correlationId, '', 'counter correlation does match');
        });
        it('validate counter simple write resolution 5', function() {
            const ms = new MockSink();
            const opt = {
                resolution: 5,
                uom: 'click(s)',
            };
            const c = new Counter('test-counter', new Array(ms), opt);
            for (let i = 0; i < 10; i++) {
                c.increment();
            }
            assert.equal(ms._sinkData.length, 2, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            assert.equal(r.name, 'test-counter', 'counter name does match');
            assert.equal(r.type, 1, 'counter type does match');
            assert.equal(r.uom, 'click(s)', 'counter uom does match');
            assert.equal(r.value, 10, 'counter value does match');
            assert.equal(r.correlationId, '', 'counter correlation does match');
        });
        it('validate counter tag write', function() {
            const ms = new MockSink();
            const opt = {
                uom: 'click(s)',
                tags: [
                    'tag1',
                    { special: 'value' },
                ],
            };
            const c = new Counter('test-counter', new Array(ms), opt);
            c.increment();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            assert.equal(r.name, 'test-counter', 'counter name does match');
            assert.equal(r.type, 1, 'counter type does match');
            assert.equal(r.uom, 'click(s)', 'counter uom does match');
            assert.equal(r.value, 1, 'counter value does match');
            assert.equal(r.correlationId, '', 'counter correlation does match');
            assert.isTrue(contains(r.tags, 'tag1'), 'no tag1 result');
            assert.isTrue(contains(r.tags, 'special'), 'no key value pair tag result');
        });
    });
});
