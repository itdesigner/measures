




import {assert} from 'chai';
import {APM, defaultAPM, defaultConsoleAPM, defaultDataDogAPM} from '../src';
import {Logger} from '../src/logging';
import {Counter, Gauge, HealthCheck, Meter, Timer} from '../src/measures';
import {IMeasureOptions, MeasureType, Tag} from '../src/shared';
import {ConsoleSink, ISink} from '../src/sinks';
import {MockSink} from './mock-sink';

function getMockSink(): ISink[] {
    return new Array(new MockSink());
}

let functionSinkItems: any[] = [];

function functionSink(item: any): void {
    functionSinkItems.push(item);
}

function dummyNumberOperation(): number {
    return 10;
}

function dummyBooleanOperation(): boolean {
    return false;
}

const my_opts: IMeasureOptions = {
    correlationId: 'abc',
    uom: 'operation(s)',
    cpu: true,
    mem: true,
    resolution: 10,
    directWrite: true,
    tags: [
        { note: 'of crap' },
        { label: 'another label' },
        'danger',
    ],
};
const my_tags: Tag[] = [
    { note: 'of crap' },
    { label: 'another label' },
    'danger',
];

describe('APM', function() {
    describe('apm constructors', function() {
        it('create a default APM instance', function() {
            const a = new APM();
            assert.exists(a, 'could not create APM');
            assert.isArray(a.sinks, 'sinks are not valid');
        });
        it('create a default APM (explicit sink)', function() {
            const a = new APM(getMockSink());
            assert.exists(a, 'could not create APM');
            assert.isArray(a.sinks, 'sinks are not valid');
            assert.equal(a.sinks.length, 1, 'invalid number of sinks');
        });
        it('create a default APM (sink function)', function() {
            const a = new APM(functionSink);
            assert.exists(a, 'could not create APM');
            assert.isFunction(a.sinks, 'sinks are not a valid function');
        });
        it('create a default APM (defaultAPM method)', function() {
            const a = defaultAPM();
            assert.exists(a, 'could not create APM');
            assert.isArray(a.sinks, 'sinks are not valid');
            assert.equal(a.sinks.length, 1, 'invalid number of sinks');
            if (Array.isArray(a.sinks)) {
                assert.isUndefined(((a.sinks[0]) as ConsoleSink).formatter, 'should not have a formatter');
            }
        });
        it('create a default APM (defaultConsoleAPM method)', function() {
            const a = defaultConsoleAPM();
            assert.exists(a, 'could not create APM');
            assert.isArray(a.sinks, 'sinks are not valid');
            assert.equal(a.sinks.length, 1, 'invalid number of sinks');
            if (Array.isArray(a.sinks)) {
                assert.isFunction(((a.sinks[0]) as ConsoleSink).formatter, 'should have a formatter');
            }
        });
        it('create a default APM (defaultDataDogAPM method)', function() {
            const a = defaultDataDogAPM();
            assert.exists(a, 'could not create APM');
            assert.isArray(a.sinks, 'sinks are not valid');
            assert.equal(a.sinks.length, 1, 'invalid number of sinks');
            if (Array.isArray(a.sinks)) {
                assert.isFunction(((a.sinks[0]) as ConsoleSink).formatter, 'should have a formatter');
            }
        });
    });
    describe('apm functions', function() {
        it('validate sink defaulter works', function() {
            const a = new APM();
            const t: Timer = a.timeOperation('timer', getMockSink()) as Timer;
            assert.exists(t, 'couldnt create a timer');
            assert.equal(t.name, 'timer');
            assert.equal(t.type, MeasureType.Timer);
            assert.equal(t.correlationId, '', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 0, 'should be no tags');
            }
            assert.equal(t.sinks.length, 1, 'sinks do not match');
        });
        it('validate sink defaulter works with an empty array', function() {
            const a = new APM(getMockSink());
            const t: Timer = a.timeOperation('timer', new Array<ISink>()) as Timer;
            assert.exists(t, 'couldnt create a timer');
            assert.equal(t.name, 'timer');
            assert.equal(t.type, MeasureType.Timer);
            assert.equal(t.correlationId, '', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 0, 'should be no tags');
            }
            assert.equal(t.sinks.length, 1, 'sinks do not match');
        });
        it('create a timer with no options', function() {
            const a: APM = new APM(getMockSink());
            const t: Timer = a.timeOperation('timer') as Timer;
            assert.exists(t, 'couldnt create a timer');
            assert.equal(t.name, 'timer');
            assert.equal(t.type, MeasureType.Timer);
            assert.equal(t.correlationId, '', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 0, 'should be no tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a timer with options', function() {
            const a: APM = new APM(getMockSink());
            const t: Timer = a.timeOperation('timer', undefined, my_opts) as Timer;
            assert.exists(t, 'couldnt create a timer');
            assert.equal(t.name, 'timer');
            assert.equal(t.type, MeasureType.Timer);
            assert.equal(t.correlationId, 'abc', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 3, 'should be no tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a counter with no options', function() {
            const a: APM = new APM(getMockSink());
            const t: Counter = a.countOperation('counter') as Counter;
            assert.exists(t, 'couldnt create a counter');
            assert.equal(t.name, 'counter');
            assert.equal(t.type, MeasureType.Counter);
            assert.equal(t.correlationId, '', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 0, 'should be no tags');
            }
            assert.equal(t.directWrite, true, 'directWrite incorrect');
            assert.equal(t.resolution, 1, 'incorrect resolution');
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a counter with options', function() {
            const a: APM = new APM(getMockSink());
            const t: Counter = a.countOperation('counter', undefined, my_opts) as Counter;
            assert.exists(t, 'couldnt create a counter');
            assert.equal(t.name, 'counter');
            assert.equal(t.type, MeasureType.Counter);
            assert.equal(t.correlationId, 'abc', 'incorrect correlation id');
            assert.equal(t.directWrite, true, 'directWrite incorrect');
            assert.equal(t.resolution, 10, 'incorrect resolution');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 3, 'should be 3 tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a gauge with no options', function() {
            const a: APM = new APM(getMockSink());
            const t: Gauge = a.gaugeOperation('gauge', dummyNumberOperation) as Gauge;
            assert.exists(t, 'couldnt create a gauge');
            assert.equal(t.name, 'gauge');
            assert.equal(t.type, MeasureType.Gauge);
            assert.equal(t.correlationId, '', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 0, 'should be no tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a gauge with options', function() {
            const a: APM = new APM(getMockSink());
            const t: Gauge = a.gaugeOperation('gauge', dummyNumberOperation, undefined, my_opts) as Gauge;
            assert.exists(t, 'couldnt create a gauge');
            assert.equal(t.name, 'gauge');
            assert.equal(t.type, MeasureType.Gauge);
            assert.equal(t.correlationId, 'abc', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 3, 'should be 3 tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a healthcheck with no options', function() {
            const a: APM = new APM(getMockSink());
            const t: HealthCheck = a.healthOperation('healthcheck', dummyBooleanOperation) as HealthCheck;
            assert.exists(t, 'couldnt create a healthcheck');
            assert.equal(t.name, 'healthcheck');
            assert.equal(t.type, MeasureType.Health);
            assert.equal(t.correlationId, '', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 0, 'should be no tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a healthcheck with options', function() {
            const a: APM = new APM(getMockSink());
            const t: HealthCheck = a.healthOperation('healthcheck', dummyBooleanOperation, undefined, my_opts) as HealthCheck;
            assert.exists(t, 'couldnt create a healthcheck');
            assert.equal(t.name, 'healthcheck');
            assert.equal(t.type, MeasureType.Health);
            assert.equal(t.correlationId, 'abc', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 3, 'should be 3 tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a meter with no options', function() {
            const a: APM = new APM(getMockSink());
            const t: Meter = a.meterOperation('meter') as Meter;
            assert.exists(t, 'couldnt create a meter');
            assert.equal(t.name, 'meter');
            assert.equal(t.type, MeasureType.Meter);
            assert.equal(t.correlationId, '', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 0, 'should be no tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });
        it('create a meter with options', function() {
            const a: APM = new APM(getMockSink());
            const t: Meter = a.meterOperation('meter', undefined, my_opts) as Meter;
            assert.exists(t, 'couldnt create a meter');
            assert.equal(t.name, 'meter');
            assert.equal(t.type, MeasureType.Meter);
            assert.equal(t.correlationId, 'abc', 'incorrect correlation id');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 3, 'should be 3 tags');
            }
            assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
        });

        it('create a logger with no options', function() {
            const a: APM = new APM(getMockSink());
            const t: Logger = a.logger('logger') as Logger;
            assert.exists(t, 'couldnt create a logger');
            assert.equal(t.context, 'logger');
            assert.isUndefined(t.tags, 'should be no tags');
            if (Array.isArray(t.sinks)) {
                assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
            }
        });
        it('create a logger with options', function() {
            const a: APM = new APM(getMockSink());
            const t: Logger = a.logger('logger', undefined, my_tags) as Logger;
            assert.exists(t, 'couldnt create a logger');
            assert.equal(t.context, 'logger');
            if (Array.isArray(t.tags)) {
                assert.equal(t.tags.length, 3, 'should be 3 tags');
            }
            if (Array.isArray(t.sinks)) {
                assert.equal(t.sinks.length, a.sinks.length, 'sinks do not match');
            }
        });
        it('send an arbitratu log message to an ISink array', function() {
            const a: APM = new APM();
            const ms = new MockSink();
            a.sendLog('message', new Array<ISink>(ms));
            assert.equal(ms.messageCount, 1, 'message should have gone to the sink');
            const msg = ms.sinkData.pop();
            assert.equal(msg, 'message', 'messages do not match');
        });
        it('send an arbitratu log message to an ISinkFunction', function() {
            const a: APM = new APM();
            functionSinkItems = [];
            a.sendLog('message', functionSink);
            assert.equal(functionSinkItems.length, 1, 'message should have gone to the sink');
            const msg = functionSinkItems[0];
            assert.equal(msg, 'message', 'messages do not match');
        });
    });
});
