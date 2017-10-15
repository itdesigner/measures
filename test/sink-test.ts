import {assert} from 'chai';
import * as moment from 'moment';
import {ILogMessage, IMeasureMessage, LogLevel, MeasureType} from '../src/shared';
import {ConsoleSink, ddformat as ddformatter, simpleformat as simpleformatter} from '../src/sinks';


function functionLogLevel() {
    return LogLevel.CRITICAL;
}
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
};
const measureMessage: IMeasureMessage = {
    timestamp: moment().toDate(),
    name: 'method',
    type: MeasureType.Timer,
    value: 1.1,
    correlationId: 'abc',
    tags: [
        'tag1',
        { special: 'value' },
    ],
};

describe('console sinks', function() {
    describe('console sink constructors', function() {
        it('create a basic sink - no formatter', function() {
            const s = new ConsoleSink();
            assert.exists(s, 'unable to create a console sink');
            assert.equal(s.logLevel, LogLevel.INFO, 'incorrect log level');
            assert.isUndefined(s.formatter, '\'should be no formatter');
        });
        it('create a basic sink - simple formatter', function() {
            const s = new ConsoleSink(LogLevel.DEBUG, simpleformatter);
            assert.exists(s, 'unable to create a console sink');
            assert.equal(s.logLevel, LogLevel.DEBUG, 'incorrect log level');
            assert.isFunction(s.formatter, '\'should be a simple formatter');
        });
        it('create a basic sink - datadog formatter', function() {
            const s = new ConsoleSink(LogLevel.VERBOSE, ddformatter);
            assert.exists(s, 'unable to create a console sink');
            assert.equal(s.logLevel, LogLevel.VERBOSE, 'incorrect log level');
            assert.isFunction(s.formatter, '\'should be a datadog formatter');
        });
        it('create a basic sink with a loglevel warning and above', function() {
            const s = new ConsoleSink(LogLevel.WARNING);
            assert.exists(s, 'unable to create a console sink');
            assert.equal(s.logLevel, LogLevel.WARNING, 'incorrect log level');
            assert.isUndefined(s.formatter, '\'should be no formatter');
        });
        it('create a sink that uses a loglevel function', function() {
            const s = new ConsoleSink(functionLogLevel);
            assert.exists(s, 'unable to create a console sink');
            assert.isFunction(s.logLevel, 'incorrect loglevel functionl');
            assert.isUndefined(s.formatter, '\'should be no formatter');
        });
    });
    describe('sink functions', function() {
        it('test a basic string write', function() {
            const s = new ConsoleSink();
            const m = 'my test message';
            const intercept = require('intercept-stdout');
            let captured_text = '';
            const unhook = intercept(function(txt: string) {
                captured_text += txt;
                return '';
            });
            s.send(m);
            unhook();
            assert.equal(captured_text, '"' + m + '"\n', 'sink write does not match');
        });
        it('test a basic log message write', function() {
            const s = new ConsoleSink();
            const m = logMsg;
            m.level = LogLevel.WARNING;
            const intercept = require('intercept-stdout');
            let captured_text = '';
            const unhook = intercept(function(txt: string) {
                captured_text += txt;
                return '';
            });
            s.send(m);
            unhook();
            const co = JSON.parse(captured_text);
            assert.equal(co.level, m.level, 'level not correct');
            const d = moment(co.timestamp).toISOString();
            const b = moment(m.timestamp).toISOString();
            assert.equal(d, b, 'timestamp not correct');
            assert.equal(co.name, m.name, 'name not correct');
            assert.equal(JSON.stringify(co.args), JSON.stringify(m.args), 'args not correct');
            assert.equal(co.results, m.results, 'results not correct');
            assert.equal(co.message, m.message, 'message not correct');
            assert.equal(JSON.stringify(co.tags), JSON.stringify(m.tags), 'tags not correct');
        });
        it('test a basic log message does not write if log level too low', function() {
            const s = new ConsoleSink();
            const m = logMsg;
            m.level = LogLevel.DEBUG;
            const intercept = require('intercept-stdout');
            let captured_text = '';
            const unhook = intercept(function(txt: string) {
                captured_text += txt;
                return '';
            });
            s.send(m);
            unhook();
            assert.equal(captured_text, '');
        });
        it('test a basic log message does not write if log level too low (function-based)', function() {
            const s = new ConsoleSink(functionLogLevel);
            const m = logMsg;
            m.level = LogLevel.WARNING;
            const intercept = require('intercept-stdout');
            let captured_text = '';
            const unhook = intercept(function(txt: string) {
                captured_text += txt;
                return '';
            });
            s.send(m);
            unhook();
            assert.equal(captured_text, '', 'message log level was too low and should have been blocked');
        });
        it('test a basic log message does  write if log level high enough (function-based)', function() {
            const s = new ConsoleSink(functionLogLevel);
            const m = logMsg;
            m.level = LogLevel.CRITICAL;
            const intercept = require('intercept-stdout');
            let captured_text = '';
            const unhook = intercept(function(txt: string) {
                captured_text += txt;
                return '';
            });
            s.send(m);
            unhook();
            const co = JSON.parse(captured_text);
            assert.equal(co.level, m.level, 'level not correct');
            const d = moment(co.timestamp).toISOString();
            const b = moment(m.timestamp).toISOString();
            assert.equal(d, b, 'timestamp not correct');
            assert.equal(co.name, m.name, 'name not correct');
            assert.equal(JSON.stringify(co.args), JSON.stringify(m.args), 'args not correct');
            assert.equal(co.results, m.results, 'results not correct');
            assert.equal(co.message, m.message, 'message not correct');
            assert.equal(JSON.stringify(co.tags), JSON.stringify(m.tags), 'tags not correct');
        });
        it('test a basic measure message write', function() {
            const s = new ConsoleSink();
            const m = measureMessage;
            const intercept = require('intercept-stdout');
            let captured_text = '';
            const unhook = intercept(function(txt: string) {
                captured_text += txt;
                return '';
            });
            s.send(m);
            unhook();
            const co = JSON.parse(captured_text);
            assert.equal(co.type, m.type, 'type not correct');
            const d = moment(co.timestamp).toISOString();
            const b = moment(m.timestamp).toISOString();
            assert.equal(d, b, 'timestamp not correct');
            assert.equal(co.name, m.name, 'name not correct');
            assert.equal(co.value, m.value, 'value not correct');
            assert.equal(co.correlationId, m.correlationId, 'correlation id not correct');
            assert.equal(JSON.stringify(co.tags), JSON.stringify(m.tags), 'tags not correct');
        });
        it('test a basic measure message write with a simple formatter', function() {
            const s = new ConsoleSink(LogLevel.VERBOSE, simpleformatter);
            const m = measureMessage;
            const intercept = require('intercept-stdout');
            let captured_text = '';
            const unhook = intercept(function(txt: string) {
                captured_text += txt;
                return '';
            });
            s.send(m);
            unhook();
            assert.equal(captured_text.substring(0, 10), 'MEASURE | ');
            const model = captured_text.substr(10);
            const co = JSON.parse(model);
            assert.equal(co.type, MeasureType[m.type], 'type not correct');
            const d = moment(co.timestamp).toISOString();
            const b = moment(m.timestamp).toISOString();
            assert.equal(d, b, 'timestamp not correct');
            assert.equal(co.name, m.name, 'name not correct');
            assert.equal(co.value, m.value, 'value not correct');
            assert.equal(co.correlationId, m.correlationId, 'correlation id not correct');
            assert.equal(JSON.stringify(co.tags), JSON.stringify(m.tags), 'tags not correct');
        });
    });
});
