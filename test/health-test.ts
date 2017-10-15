import {assert} from 'chai';
import * as moment from 'moment';
import {HealthCheck} from '../src/measures';
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

function testHealthFunction() {
    return false;
}

describe('healths', function() {
    describe('health constructors', function() {
        const ctor = HealthCheck as any;
        it('create a default health with only a name and mocksink', function() {
            const c = new HealthCheck('test-health', getMockSink(), testHealthFunction);
            assert.exists(c, 'health does not exist (null or undefined)');
            assert.equal(c.name, 'test-health', 'incorrect health name');
            assert.equal(c.type, 5, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
        });
        it('create a default health with only a name and sink function', function() {
            const c = new HealthCheck('test-health', functionSink, testHealthFunction);
            assert.exists(c, 'health does not exist (null or undefined)');
            assert.equal(c.name, 'test-health', 'incorrect health name');
            assert.equal(c.type, 5, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsFunction(c.sinks), 'sink should be a function');
        });
        it('create a health with no name', function() {
            assert.throws(() => new ctor(), /Invalid arguments: name is required/, 'health should throw exception');
        });
        it('create a health with no sink', function() {
            assert.throws(() => new ctor('test-health'), /Invalid arguments: sinks are required/, 'health should throw exception');
        });
        it('create a health with no operation', function() {
            assert.throws(() => new ctor('test-health', getMockSink()), /invalid healthcheck function/, 'health should throw an exception');
        });
        it('create a health with MeasureOptions', function() {
            const c = new HealthCheck('test-health', getMockSink(), testHealthFunction, getTestOptions());
            assert.exists(c, 'health does not exist (null or undefined)');
            assert.equal(c.name, 'test-health', 'incorrect health name');
            assert.equal(c.type, 5, 'incorrect measure type');
            assert.equal(c.uom, 'click(s)', 'incorrent unit of mesure');
            assert.equal(c.correlationId, 'abc', 'incorrect correlation id');
        });
        it('create a health with empty MeasureOptions', function() {
            const c = new HealthCheck('test-health', getMockSink(), testHealthFunction, {});
            assert.exists(c, 'health does not exist (null or undefined)');
            assert.equal(c.name, 'test-health', 'incorrect health name');
            assert.equal(c.type, 5, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(c.correlationId, '', 'incorrect correlation id');
        });
    });
    describe('health functionality', function() {
        it('validate health simple write ', function() {
            const ms = new MockSink();
            const c = new HealthCheck('test-health', new Array(ms), testHealthFunction);
            c.write();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'health timestamp not correct');
            assert.equal(r.name, 'test-health', 'health name does match');
            assert.equal(r.type, 5, 'health type does match');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.isFalse(r.value, 'health value is not correct');
            assert.equal(r.correlationId, '', 'health correlation does match');
        });
        it('validate health simple write to sink function', function() {
            const c = new HealthCheck('test-health', functionSink, testHealthFunction);
            c.write();
            assert.equal(functionSinkItems.length, 1, 'incorrect number of measures in the sink');
            const r = functionSinkItems.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'health timestamp not correct');
            assert.equal(r.name, 'test-health', 'health name does match');
            assert.equal(r.type, 5, 'health type does match');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.isFalse(r.value, 'health value is not correct');
            assert.equal(r.correlationId, '', 'health correlation does match');
        });
        it('validate health tag write', function() {
            const ms = new MockSink();
            const opt = {
                correlationId: 'abc',
                tags: [
                    'tag1',
                    { special: 'value' },
                ],
            };
            const c = new HealthCheck('test-health', new Array(ms), testHealthFunction, opt);
            c.write();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            const d = moment().toDate().valueOf();
            assert.isAtMost(r.timestamp.valueOf(), d, 'health timestamp not correct');
            assert.equal(r.name, 'test-health', 'health name does match');
            assert.equal(c.uom, 'operation(s)', 'incorrent unit of mesure');
            assert.equal(r.type, 5, 'health type does match');
            assert.isFalse(r.value, 'health value is not correct');
            assert.equal(r.correlationId, 'abc', 'health correlation does match');
            assert.isTrue(contains(r.tags, 'tag1'), 'no tag1 result');
            assert.isTrue(contains(r.tags, 'special'), 'no key value pair tag result');
        });
    });
});
