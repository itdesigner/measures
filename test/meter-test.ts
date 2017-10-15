import {assert} from 'chai';
import {Meter } from '../src/measures';
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

describe('meters', function() {
    describe('meter constructors', function() {
        const ctor = Meter as any;
        it('create a default meter with only a name and mocksink', function() {
            const c = new Meter('test-meter', getMockSink());
            assert.exists(c, 'meter does not exist (null or undefined)');
            assert.equal(c.name, 'test-meter', 'incorrect meter name');
            assert.equal(c.type, 3, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrect default unit of measure');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
        });
        it('create a default meter with only a name and sink function', function() {
            const c = new Meter('test-meter', functionSink);
            assert.exists(c, 'meter does not exist (null or undefined)');
            assert.equal(c.name, 'test-meter', 'incorrect meter name');
            assert.equal(c.type, 3, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrect default unit of measure');
            assert.equal(c.correlationId, '', 'incorrect default correlation id');
            assert.isTrue(sinkIsFunction(c.sinks), 'sink should be a function');
        });
        it('create a meter with no name', function() {
            assert.throws(() => new ctor(), /Invalid arguments: name is required/, 'meter should throw exception');
        });
        it('create a meter with no sink', function() {
            assert.throws(() => new ctor('test-meter'), /Invalid arguments: sinks are required/, 'meter should throw exception');
        });
        it('create a meter with MeasureOptions', function() {
            const c = new Meter('test-meter', getMockSink(), getTestOptions());
            assert.exists(c, 'meter does not exist (null or undefined)');
            assert.equal(c.name, 'test-meter', 'incorrect meter name');
            assert.equal(c.type, 3, 'incorrect measure type');
            assert.equal(c.uom, 'click(s)', 'incorrect unit of measure');
            assert.equal(c.correlationId, 'abc', 'incorrect correlation id');
        });
        it('create a meter with empty MeasureOptions', function() {
            const c = new Meter('test-meter', getMockSink(), {});
            assert.exists(c, 'meter does not exist (null or undefined)');
            assert.equal(c.name, 'test-meter', 'incorrect meter name');
            assert.equal(c.type, 3, 'incorrect measure type');
            assert.equal(c.uom, 'operation(s)', 'incorrect unit of measure');
            assert.equal(c.correlationId, '', 'incorrect correlation id');
        });
    });
    describe('meter functionality', function() {
        it('validate meter simple write', function() {
            const ms = new MockSink();
            const c = new Meter('test-meter', new Array(ms));
            for (let i = 0; i < 10; i++) {
                c.mark();
            }
            c.write();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            for (let i = 0; i < 1000000; i++) {
                c.mark();
            }
            c.write();
            const r = ms._sinkData.pop();
            assert.equal(r.name, 'test-meter', 'meter name does match');
            assert.equal(r.type, 3, 'meter type does match');
            assert.equal(r.uom, 'operation(s)', 'meter uom does match');
            assert.equal(r.value.count, 1000010, 'meter value count does match');
            assert.equal(c.count, 1000010, 'actual counter in meter is incorrect');
            const v = Number.parseFloat(r.value.mean);
            assert.isAbove(c.rates.mean, 0 , 'actual meter value should have a positive mean rate');
            assert.isAbove(v, 0, 'meter value rate does match');
            assert.equal(r.correlationId, '', 'meter correlation does match');
        });
        it('validate meter simple write to sink function', function() {
            const c = new Meter('test-meter', functionSink);
            for (let i = 0; i < 10; i++) {
                c.mark();
            }
            c.write();
            assert.equal(functionSinkItems.length, 1, 'incorrect number of measures in the sink');
            const r = functionSinkItems.pop();
            assert.equal(r.name, 'test-meter', 'meter name does match');
            assert.equal(r.type, 3, 'meter type does match');
            assert.equal(r.uom, 'operation(s)', 'meter uom does match');
            assert.equal(r.value.count, 10, 'meter value count does match');
            const v = Number.parseFloat(r.value.mean);
            assert.isAbove(v, 0, 'meter value rate does match');
            assert.equal(r.correlationId, '', 'meter correlation does match');
        });
        it('validate meter tag write', function() {
            const ms = new MockSink();
            const opt = {
                uom: 'click(s)',
                tags: [
                    'tag1',
                    { special: 'value' },
                ],
            };
            const c = new Meter('test-meter', new Array(ms), opt);
            for (let i = 0; i < 1000010; i++) {
                c.mark();
            }
            c.write();
            assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
            const r = ms._sinkData.pop();
            assert.equal(r.name, 'test-meter', 'meter name does match');
            assert.equal(r.type, 3, 'meter type does match');
            assert.equal(r.uom, 'click(s)', 'meter uom does match');
            assert.equal(r.value.count, 1000010, 'meter value count does match');
            const v = Number.parseFloat(r.value.mean);
            assert.isAbove(v, 0, 'meter value rate does match');
            assert.equal(r.correlationId, '', 'meter correlation does match');
            assert.isTrue(contains(r.tags, 'tag1'), 'no tag1 result');
            assert.isTrue(contains(r.tags, 'special'), 'no key value pair tag result');
        });
        // it('validate meter write with ticks (long running)', function() {
        //     let ms = new MockSink();
        //     let c = new Meter('test-meter', new Array(ms));
        //     for (let i = 0; i < 10; i++) {
        //         c.mark();
        //     }
        //     c.write();
        //     assert.equal(ms._sinkData.length, 1, 'incorrect number of measures in the sink');
        //     for (let i = 0; i < 1000000; i++) {
        //         c.mark();
        //     }
        //     c.write();
        //     let s = moment().add(8,'s');
        //     while (moment() < s) {
        //         //spin
        //     }
        //     c.write();
        //     var r = ms._sinkData.pop();
        //     assert.equal(r.name, 'test-meter', 'meter name does match');
        //     assert.equal(r.type, 3, 'meter type does match');
        //     assert.equal(r.uom, 'operation(s)', 'meter uom does match');
        //     assert.equal(r.value.count, 1000010, 'meter value count does match');
        //     assert.equal(c.count, 1000010, 'actual counter in meter is incorrect');
        //     let v = Number.parseFloat(r.value.mean);
        //     assert.isAbove(c.rates.mean, 0 , 'actual meter value should have a positive mean rate');
        //     assert.isAbove(v, 0, 'meter value rate does match');
        //     assert.equal(r.correlationId, '', 'meter correlation does match');
        // })
    });
});
