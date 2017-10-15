import {assert} from 'chai';
import * as moment from 'moment';
import {ILogMessage, IMeasureMessage, LogLevel, MeasureType} from '../src/shared';
import {ddformat as ddformatter, simpleformat as simpleformatter} from '../src/sinks';

const logMsg: ILogMessage = {
    timestamp: moment().toDate(),
    name: 'method',
    level: LogLevel.DEBUG,
    args: [1, 2, 3],
    results: 6,
    message: 'the message',
    tags: [
        'tag1',
        { special: 'value' },
    ],
    error: 'error',
};
const simpleMsg: ILogMessage = {
    timestamp: moment().toDate(),
    name: 'method',
    level: LogLevel.DEBUG,
};
const measureMessage: IMeasureMessage = {
    timestamp: moment().toDate(),
    name: 'method',
    type: MeasureType.Timer,
    uom: 'loop time',
    duration: 10,
    rate: 5,
    value: 1.1,
    correlationId: 'abc',
    tags: [
        'tag1',
        { special: 'value' },
    ],
};
const taglessMeasureMessage: IMeasureMessage = {
    timestamp: moment().toDate(),
    name: 'method',
    type: MeasureType.Timer,
    uom: 'loop time',
    duration: 10,
    rate: 5,
    value: 1.1,
    correlationId: 'abc',
};
const simpleMeasure: IMeasureMessage = {
    timestamp: moment().toDate(),
    name: 'method',
    type: MeasureType.Counter,
};

describe('formatter tests', function() {
    describe('simple formatter', function() {
        it('test that a simple message is formatted properly', function() {
            const s = simpleformatter;
            const r = s('string message');
            assert.isTrue(r.startsWith('MESSAGE'), 'incorrect start for a simple message');
            assert.isTrue(r.endsWith('string message'), 'missing the simple string message');
        });
        it('test that a simple reduced log message is formatted properly', function() {
            const s = simpleformatter;
            const r = s(simpleMsg);
            assert.isTrue(r.startsWith('LOG'), 'incorrect start for a simple message');
            const msgBody = r.substring(6);
            const co = JSON.parse(msgBody);
            assert.equal(co.name, 'method', 'invalid name');
        });
        it('test that a log message is formatted properly', function() {
            const s = simpleformatter;
            const r = s(logMsg);
            assert.isTrue(r.startsWith('LOG'), 'incorrect start for a simple message');
            const msgBody = r.substring(6);
            const co = JSON.parse(msgBody);
            assert.equal(co.name, 'method', 'invalid name');
            assert.equal(co.message, 'the message', 'message block invalid');
            assert.equal(co.results, 6, 'invalid results');
            assert.equal(co.level, 'DEBUG', 'invalid level');
            assert.equal(co.error, 'error', 'invalid error');
            assert.isTrue(Array.isArray(co.args), 'invalid args - not array');
            assert.equal(co.args[0], 1, 'invalid args - values');
        });
        it('test that a simple reduced measure message is formatted properly', function() {
            const s = simpleformatter;
            const r = s(simpleMeasure);
            assert.isTrue(r.startsWith('MEASURE'), 'incorrect start for a simple message');
            const msgBody = r.substring(10);
            const co = JSON.parse(msgBody);
            assert.equal(co.name, 'method', 'invalid name');
        });
        it('test that a measure message is formatted properly', function() {
            const s = simpleformatter;
            const r = s(measureMessage);
            assert.isTrue(r.startsWith('MEASURE'), 'incorrect start for a simple message');
            const msgBody = r.substring(10);
            const co = JSON.parse(msgBody);
            assert.equal(co.name, 'method', 'invalid name');
            assert.equal(co.uom, 'loop time', 'uom block invalid');
            assert.equal(co.duration, 10, 'invalid duration');
            assert.equal(co.rate, 5, 'invalid rate');
            assert.equal(co.value, 1.1, 'invalid value');
            assert.equal(co.correlationId, 'abc', 'invalid correelation id');
            assert.isTrue(Array.isArray(co.tags), 'invalid tags - not array');
            assert.equal(co.tags[0], 'tag1', 'invalid tags - values');
        });
    });
    describe('datadog formatter', function() {
        it('test that a simple message is formatted properly', function() {
            const s = ddformatter;
            const r = s('string message');
            assert.isTrue(r.startsWith('MESSAGE'), 'incorrect start for a simple message');
            assert.isTrue(r.endsWith('string message'), 'missing the simple string message');
        });
        it('test that a log message is formatted properly', function() {
            const s = ddformatter;
            const r = s(logMsg);
            assert.isTrue(r.startsWith('LOG'), 'incorrect start for a simple message');
            const msgBody = r.substring(6);
            const co = JSON.parse(msgBody);
            assert.equal(co.name, 'method', 'invalid name');
            assert.equal(co.message, 'the message', 'message block invalid');
            assert.equal(co.results, 6, 'invalid results');
            assert.equal(co.level, 1, 'invalid level');
            assert.equal(co.error, 'error', 'invalid error');
            assert.isTrue(Array.isArray(co.args), 'invalid args - not array');
            assert.equal(co.args[0], 1, 'invalid args - values');
        });
        it('test that a general measure message is formatted properly', function() {
            const s = ddformatter;
            const r = s(measureMessage);
            const part = r.split('|');
            assert.equal(part[0], 'MONITORING', 'incorrect header tag');
            assert.equal(part[2], '1.1000', 'incorrect value');
            assert.equal(part[3], 'timer', 'incorrect type');
            assert.equal(part[4], 'method', 'incorrect name');
            assert.equal(part[5], '#tag1,special:value', 'incorrect tags');
        });
        it('test that a health measure message is formatted properly', function() {
            const s = ddformatter;
            const h = measureMessage;
            h.type = MeasureType.Health;
            h.value = true;
            const r = s(measureMessage);
            const part = r.split('|');
            assert.equal(part[0], 'MONITORING', 'incorrect header tag');
            assert.equal(part[2], 'true', 'incorrect value');
            assert.equal(part[3], 'health', 'incorrect type');
            assert.equal(part[4], 'method', 'incorrect name');
            assert.equal(part[5], '#tag1,special:value', 'incorrect tags');
        });
        it('test that a meter measure message is formatted properly', function() {
            const s = ddformatter;
            const h = measureMessage;
            h.type = MeasureType.Meter;
            const v = {
                mean: 10,
                oneMinRate: 9,
                fiveMinRate: 8,
                fifteenMinRate: 7,
            };
            h.value = v;
            const r = s(measureMessage);
            const part = r.split('|');
            assert.equal(part[0], 'MONITORING', 'incorrect header tag');
            assert.equal(part[2], '10', 'incorrect value (mean)');
            assert.equal(part[3], 'meter', 'incorrect type');
            assert.equal(part[4], 'method', 'incorrect name');
            assert.equal(part[5], '#tag1,special:value,count:undefined,oneMinRate:9,fiveMinRate:8,fifteenMinRate:7', 'incorrect tags');
        });
        it('test formatter works with no tags', function(){
            const s = ddformatter;
            const r = s(taglessMeasureMessage);
            const part = r.split('|');
            assert.equal(part[0], 'MONITORING', 'incorrect header tag');
            assert.equal(part[2], '1.1000', 'incorrect value');
            assert.equal(part[3], 'timer', 'incorrect type');
            assert.equal(part[4], 'method', 'incorrect name');
        });
        it('test formatter works with a single tag', function(){
            const s = ddformatter;
            const m = taglessMeasureMessage;
            m.tags = 'abc';
            const r = s(taglessMeasureMessage);
            const part = r.split('|');
            assert.equal(part[0], 'MONITORING', 'incorrect header tag');
            assert.equal(part[2], '1.1000', 'incorrect value');
            assert.equal(part[3], 'timer', 'incorrect type');
            assert.equal(part[4], 'method', 'incorrect name');
            assert.equal(part[5], '#abc', 'incorrect tags');
        });
    });
});
