
import {assert} from 'chai';
import * as moment from 'moment';
import {Timer } from '../src/measures';
import {IKeyValueTag, IMeasureOptions} from '../src/shared';
import {ISink} from '../src/sinks';
import {MockSink} from './mock-sink';
import {contains, findTag, sinkIsArray, sinkIsFunction} from './utilities';

function getTestOptions(): IMeasureOptions {
    const my_options = {
        correlationId: 'abc',
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

describe('timers', function() {
    describe('timer constructors', function() {
        const ctor = Timer as any;
        it('create a default timer with only a name and mocksink', function() {
            const c = new Timer('test-timer', getMockSink());
            assert.exists(c, 'timer does not exist (null or undefined)');
            assert.equal(c.name, 'test-timer', 'incorrect timer name');
            assert.equal(c.type, 4, 'incorrect measure type');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
        });
        it('create a default timer with only a name and sink function', function() {
            const c = new Timer('test-timer', functionSink);
            assert.exists(c, 'timer does not exist (null or undefined)');
            assert.equal(c.name, 'test-timer', 'incorrect timer name');
            assert.equal(c.type, 4, 'incorrect measure type');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsFunction(c.sinks), 'sink should be a function');
        });
        it('create a timer with MeasureOptions', function() {
            const c = new Timer('test-timer', getMockSink(), getTestOptions());
            assert.exists(c, 'timer does not exist (null or undefined)');
            assert.equal(c.name, 'test-timer', 'incorrect timer name');
            assert.equal(c.type, 4, 'incorrect measure type');
            assert.equal(c.correlationId, 'abc', 'incorrect correlation id');
        });
        it('create a timer with empty MeasureOptions', function() {
            const c = new Timer('test-timer', getMockSink(), {});
            assert.exists(c, 'timer does not exist (null or undefined)');
            assert.equal(c.name, 'test-timer', 'incorrect timer name');
            assert.equal(c.type, 4, 'incorrect measure type');
            assert.equal(c.correlationId, '', 'incorrect correlation id');
        });
        it('prevent create a timer with no name', function() {
            assert.throws(() => new ctor(), /Invalid arguments: name is required/, 'timer should throw exception');
        });
        it('prevent create a timer with no sink', function() {
            assert.throws(() => new ctor('test-gauge'), /Invalid arguments: sinks are required/, 'timer should throw exception');
        });
    });
    describe('timer functionality', function() {
        it('validate timer simple write ', function() {
            const ms = new MockSink();
            const c = new Timer('test-timer', new Array(ms));
            c.start();
            for (let i = 0; i < 1000000; i++) {
                // do nothing
            }
            c.stop();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'timer timestamp not correct');
            assert.equal(r.name, 'test-timer', 'timer name does match');
            assert.equal(r.type, 4, 'timer type does match');
            assert.isAbove(r.value, 0, 'timer value is not gereater than zero');
            assert.equal(r.correlationId, '', 'timer correlation does match');
        });
        it('validate timer simple write to sink function', function() {
            const c = new Timer('test-timer', functionSink);
            c.start();
            for (let i = 0; i < 10; i++) {
                // do nothing
            }
            c.stop();
            assert.equal(functionSinkItems.length, 1, 'incorrect number of measures in the sink');
            const r = functionSinkItems.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'timer timestamp not correct');
            assert.equal(r.name, 'test-timer', 'timer name does match');
            assert.equal(r.type, 4, 'timer type does match');
            assert.isAbove(r.value, 0, 'timer value is not gereater than zero');
            assert.equal(r.correlationId, '', 'timer correlation does match');
        });
        it('validate timer with cpu and memory capture', function() {
            const ms: MockSink = new MockSink();
            const opt: IMeasureOptions = {
                correlationId: 'abc',
                cpu: true,
                mem: true,
                tags: [
                    'tag1',
                    { special: 'value' },
                ],
            };
            const c = new Timer('test-timer', new Array(ms), opt);
            c.start();
            for (let i = 0; i < 1000000; i++) {
                // do nothing
            }
            c.stop();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'timer timestamp not correct');
            assert.equal(r.name, 'test-timer', 'timer name does match');
            assert.equal(r.type, 4, 'timer type does match');
            assert.isAbove(r.value, 0, 'timer value is not gereater than zero');
            assert.equal(r.correlationId, 'abc', 'timer correlation does match');
            assert.isTrue(contains(r.tags, 'tag1'), 'no tag1 result');
            assert.isTrue(contains(r.tags, 'special'), 'no key value pair tag result');
            assert.isTrue(contains(r.tags, 'cpu'), 'no cpu result');
            assert.isTrue(contains(r.tags, 'total_mem'), 'no total_mem tag result');
            assert.isTrue(contains(r.tags, 'free_mem'), 'no free_mem tag result');
        });
        it('validate timer with cpu and memory with a pre-existing string cpu tag does not change it', function() {
            const ms: MockSink = new MockSink();
            const opt: IMeasureOptions = {
                correlationId: 'abc',
                cpu: true,
                mem: true,
                tags: [
                    'tag1',
                    { special: 'value' },
                    'cpu',
                ],
            };
            const c = new Timer('test-timer', new Array(ms), opt);
            c.start();
            for (let i = 0; i < 1000000; i++) {
                // do nothing
            }
            c.stop();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'timer timestamp not correct');
            assert.equal(r.name, 'test-timer', 'timer name does match');
            assert.equal(r.type, 4, 'timer type does match');
            assert.isAbove(r.value, 0, 'timer value is not gereater than zero');
            assert.equal(r.correlationId, 'abc', 'timer correlation does match');
            assert.isTrue(contains(r.tags, 'tag1'), 'no tag1 result');
            assert.isTrue(contains(r.tags, 'special'), 'no key value pair tag result');
            assert.isTrue(contains(r.tags, 'cpu'), 'no cpu result');
            const t = findTag(r.tags, 'cpu');
            assert.isTrue(typeof(t) === 'string', 'cpu tag should be a string value');
            assert.isTrue(contains(r.tags, 'total_mem'), 'no total_mem tag result');
            assert.isTrue(contains(r.tags, 'free_mem'), 'no free_mem tag result');
        });
        it('validate timer with cpu and memory with a pre-existing kvp cpu tag does not change it', function() {
            const ms: MockSink = new MockSink();
            const opt: IMeasureOptions = {
                correlationId: 'abc',
                cpu: true,
                mem: true,
                tags: [
                    'tag1',
                    { special: 'value' },
                    {cpu: 'abc'},
                ],
            };
            const c = new Timer('test-timer', new Array(ms), opt);
            c.start();
            for (let i = 0; i < 1000000; i++) {
                // do nothing
            }
            c.stop();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'timer timestamp not correct');
            assert.equal(r.name, 'test-timer', 'timer name does match');
            assert.equal(r.type, 4, 'timer type does match');
            assert.isAbove(r.value, 0, 'timer value is not gereater than zero');
            assert.equal(r.correlationId, 'abc', 'timer correlation does match');
            assert.isTrue(contains(r.tags, 'tag1'), 'no tag1 result');
            assert.isTrue(contains(r.tags, 'special'), 'no key value pair tag result');
            assert.isTrue(contains(r.tags, 'cpu'), 'no cpu result');
            const t = findTag(r.tags, 'cpu');
            let v = null;
            if (typeof(t) !== 'undefined') {
                const kvp: IKeyValueTag = t as IKeyValueTag;
                v = kvp.cpu;

            }
            assert.exists(v, 'original cpu tag was wiped out');
            assert.equal(v, 'abc', 'original value should not have been overwritten');
            assert.isTrue(contains(r.tags, 'total_mem'), 'no total_mem tag result');
            assert.isTrue(contains(r.tags, 'free_mem'), 'no free_mem tag result');
        });
        it('validate timer tag write', function() {
            const ms = new MockSink();
            const opt = {
                correlationId: 'abc',
                tags: [
                    'tag1',
                    { special: 'value' },
                ],
            };
            const c = new Timer('test-timer', new Array(ms), opt);
            c.start();
            for (let i = 0; i < 1000000; i++) {
                // do nothing
            }
            c.stop();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'timer timestamp not correct');
            assert.equal(r.name, 'test-timer', 'timer name does match');
            assert.equal(r.type, 4, 'timer type does match');
            assert.isAbove(r.value, 0, 'timer value is not gereater than zero');
            assert.equal(r.correlationId, 'abc', 'timer correlation does match');
            assert.isTrue(contains(r.tags, 'tag1'), 'no tag1 result');
            assert.isTrue(contains(r.tags, 'special'), 'no key value pair tag result');
        });
        it('validate timer cant be started when already running', function() {
            const ms = new MockSink();
            const c = new Timer('test-timer', new Array(ms));
            c.start();
            assert.throws(() => { c.start(); }, /Timer is already running/, 'timer should throw exception');
            c.stop();

        });
    });
});
