import {assert} from 'chai';
import * as moment from 'moment';
import {Gauge} from '../src/measures';
import {IMeasureOptions} from '../src/shared';
import {ISink} from '../src/sinks';
import {MockSink} from './mock-sink';
import {contains, sinkIsArray, sinkIsFunction} from './utilities';

function getTestOptions(): IMeasureOptions {
    const my_options = {
        correlationId: 'abc',
        uom: 'click(s)',
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

function testGagueFunction() {
    return 10;
}

describe('gauges', function() {
    describe('gauge constructors', function() {
        const ctor = Gauge as any;
        it('create a default gauge with only a name and mocksink', function() {
            const c = new Gauge('test-gauge', getMockSink(), testGagueFunction);
            assert.exists(c, 'gauge does not exist (null or undefined)');
            assert.equal(c.name, 'test-gauge', 'incorrect gauge name');
            assert.equal(c.type, 2, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
        });
        it('create a default gauge with only a name and sink function', function() {
            const c = new Gauge('test-gauge', functionSink, testGagueFunction);
            assert.exists(c, 'gauge does not exist (null or undefined)');
            assert.equal(c.name, 'test-gauge', 'incorrect gauge name');
            assert.equal(c.type, 2, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsFunction(c.sinks), 'sink should be a function');
        });
        it('prevent create a gauge with no name', function() {
            assert.throws(() => new ctor(), /Invalid arguments: name is required/, 'gauge should throw exception');
        });
        it('prevent create a gauge with no sink', function() {
            assert.throws(() => new ctor('test-gauge'), /Invalid arguments: sinks are required/, 'gauge should throw exception');
        });
        it('prevent create a gauge with no operation', function() {
            assert.throws(() => new ctor('test-gauge', getMockSink()), /invalid gauge function/, 'gauge should throw an exception');
        });
        it('create a gauge with MeasureOptions', function() {
            const c = new Gauge('test-gauge', getMockSink(), testGagueFunction, getTestOptions());
            assert.exists(c, 'gauge does not exist (null or undefined)');
            assert.equal(c.name, 'test-gauge', 'incorrect gauge name');
            assert.equal(c.type, 2, 'incorrect measure type');
            assert.equal(c.uom, 'click(s)', 'incorrent unit of mesure');
            assert.equal(c.correlationId, 'abc', 'incorrect correlation id');
        });
        it('create a gauge with empty MeasureOptions', function() {
            const c = new Gauge('test-gauge', getMockSink(), testGagueFunction, {});
            assert.exists(c, 'gauge does not exist (null or undefined)');
            assert.equal(c.name, 'test-gauge', 'incorrect gauge name');
            assert.equal(c.type, 2, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(c.correlationId, '', 'incorrect correlation id');
        });
    });
    describe('gauge functionality', function() {
        it('validate gauge simple write ', function() {
            const ms = new MockSink();
            const c = new Gauge('test-gauge', new Array(ms), testGagueFunction);
            c.write();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'gauge timestamp not correct');
            assert.equal(r.name, 'test-gauge', 'gauge name does match');
            assert.equal(r.type, 2, 'gauge type does match');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(r.value, 10, 'gauge value is not correct');
            assert.equal(r.correlationId, '', 'gauge correlation does match');
        });
        it('validate gauge simple write to sink function', function() {
            const c = new Gauge('test-gauge', functionSink, testGagueFunction);
            c.write();
            assert.equal(functionSinkItems.length, 1, 'incorrect number of measures in the sink');
            const r = functionSinkItems.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'gauge timestamp not correct');
            assert.equal(r.name, 'test-gauge', 'gauge name does match');
            assert.equal(r.type, 2, 'gauge type does match');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(r.value, 10, 'gauge value is not correct');
            assert.equal(r.correlationId, '', 'gauge correlation does match');
        });
        it('validate gauge tag write', function() {
            const ms = new MockSink();
            const opt = {
                correlationId: 'abc',
                tags: [
                    'tag1',
                    { special: 'value' },
                ],
            };
            const c = new Gauge('test-gauge', new Array(ms), testGagueFunction, opt);
            c.write();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'gauge timestamp not correct');
            assert.equal(r.name, 'test-gauge', 'gauge name does match');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(r.type, 2, 'gauge type does match');
            assert.isAbove(r.value, 0, 'gauge value is not gereater than zero');
            assert.equal(r.correlationId, 'abc', 'gauge correlation does match');
            assert.isTrue(contains(r.tags, 'tag1'), 'no tag1 result');
            assert.isTrue(contains(r.tags, 'special'), 'no key value pair tag result');
        });
    });
});
