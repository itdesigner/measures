import {assert} from 'chai';
import * as moment from 'moment';
import {APM} from '../src/APM';
import {convertLogArgs, convertLogResults, instanceOfCounter, instanceOfMeter, instanceOfTimer, isEmptyObject, setApm} from '../src/decorators/utilities';
import {ILogArgFormatterFunction, ILogResultFormatterFunction} from '../src/logging/ILoggingFunctions';
import {EWMA, StopWatch} from '../src/measures/utilities';
import {ILogMessage, IMeasureMessage, LogLevel, MeasureType} from '../src/shared';
import {ISinkFunction} from '../src/sinks';
import {instanceOfLogMessage, instanceOfMeasureMessage} from '../src/sinks/util';


const M1_ALPHA: number = 1 - Math.exp(-5 / 60);

const e: EWMA = new EWMA(M1_ALPHA, 5000);
const sinkItems: any[] = new Array<any>();
const sink: ISinkFunction = (s: string): void => {
    sinkItems.push(s);
};
const argFx: ILogArgFormatterFunction = (args: any[]): any[] => {
    const newArgs: any[] = new Array<any>();
    for (const arg of args) {
        const stringArg = (arg as string).toUpperCase();
        newArgs.push(stringArg);
    }
    return newArgs;
};
const resultFx: ILogResultFormatterFunction = (arg: any): any => {
    const newArg = (arg as string).toUpperCase();
    return newArg;
};

describe('Utilities', function() {
    describe('setApm', function() {
        it('defaults to defaultConsoleAPM', function() {
            assert.instanceOf(setApm(), APM);
            assert.instanceOf(setApm(new APM([])), APM);
            assert.throws(() => setApm(true as any));
        });
        it('creates as APM from a SinkFunction', function() {
            assert.instanceOf(setApm(sink), APM);
        });
    });
    describe('convertLogFunctions', function() {
        it('validate logarg convertion function', function() {
            const result = convertLogArgs(argFx, ['abc', 'xyz']);
            assert.equal(result.length, 2, 'results not as expected invalid length');
            assert.equal(result[0], 'ABC', 'results not as expected invalid first value');
            assert.equal(result[1], 'XYZ', 'results not as expected invalid second value');
        });
        it('validate logresult convertion function', function() {
            const result = convertLogResults(resultFx, 'abc');
            assert.equal(result, 'ABC', 'results not as expected');
        });
        it('validate logarg no op', function() {
            const result = convertLogArgs(undefined, ['abc']);
            assert.equal(result.length, 1, 'results not as expected invalid length');
            assert.equal(result[0], 'abc', 'results not as expected invalid value');
        });
        it('validate logarg opts are false', function() {
            const result = convertLogArgs(false, ['abc']);
            assert.equal(result.length, 1, 'results not as expected invalid length');
            assert.equal(result[0], 'abc', 'results not as expected invalid value');
        });
        it('validate logaresults no op', function() {
            const result = convertLogResults(undefined, 'abc');
            assert.equal(result, 'abc', 'results not as expected');
        });
        it('validate logaresults opts are false', function() {
            const result = convertLogResults(false, 'abc');
            assert.equal(result, 'abc', 'results not as expected');
        });
        it('validate logargs opts are invalid', function() {
            const result = convertLogArgs('a' as any, ['abc']);
            assert.equal(result.length, 1, 'results not as expected invalid length');
            assert.equal(result[0], 'abc', 'results not as expected invalid value');
        });
        it('validate logresults opts are invalid', function() {
            const result = convertLogResults('a' as any, 'abc');
            assert.equal(result, 'abc', 'results not as expected');
        });
        it('validate instanceOfMeter returns false', function() {
            const result = instanceOfMeter({});
            assert.isFalse(result);
        });
        it('validate instanceOfCounter returns false', function() {
            const result = instanceOfCounter({});
            assert.isFalse(result);
        });
        it('validate instanceOfTimer returns false', function() {
            const result = instanceOfTimer({});
            assert.isFalse(result);
        });
    });
    describe('isEmptyObject', function() {
        it('validate function', function() {
            const result = isEmptyObject({});
            assert.isTrue(result, 'results not as expected');
        });
        it('validate function', function() {
            const result = isEmptyObject({t: undefined});
            assert.isFalse(result, 'results not as expected');
        });
    });
    describe('EWMA', function() {
        it('validate direct ability to update', function(){
            for (let i: number = 0; i < 1000; i++) {
                e.update(1000);
            }
        });
        it('validate direct ability to default update', function(){
            for (let i: number = 0; i < 1000; i++) {
                e.update(0);
            }
        });
        it('validate direct ability to stop', function(){
            for (let i: number = 0; i < 1000; i++) {
                e.update(1000);
            }
            e.stop();
        });
    });
    describe('stop watch test', function(){
        it('create a default stopwatch', function(){
            const s = new StopWatch({});
            assert.exists(s, 'stopwatch not created');
        });
        it('create stopwatch with options', function() {
            const s = new StopWatch({getTime: Date.now()});
            assert.exists(s, 'stopwatch not created');
        });
        it('create a default stopwatch with undefined options', function(){
            const s = new StopWatch(undefined);
            assert.exists(s, 'stopwatch not created');
        });
        it('getTime from a default stopwatch', function(){
            const s = new StopWatch({});
            assert.exists(s, 'stopwatch not created');
            const t: number = s.getTime();
            assert.isAbove(t, 0, 'no time returned');
        });
        it('try and double stop a stopwatch', function(){
            const s = new StopWatch({});
            assert.exists(s, 'stopwatch not created');
            const elapsed = s.end();
            assert.isNumber(elapsed, 'no elapsed time returned');
            const elapsed2 = s.end();
            assert.isUndefined(elapsed2, 'should have just returned without a vvalue');
        });
    });
    describe('sink utilities', function(){
        it('test instanceOfMeasureMessage', function() {
            const m: IMeasureMessage = {
                name: 'name',
                type: MeasureType.Counter,
                timestamp: moment().toDate(),
            };
            assert.isTrue(instanceOfMeasureMessage(m), 'should be a measure message!');
        });
        it('test instanceOfLogMessage', function() {
            const m: ILogMessage = {
                name: 'name',
                level: LogLevel.INFO,
                timestamp: moment().toDate(),
            };
            assert.isTrue(instanceOfLogMessage(m), 'should be a log message!');
        });
    });
});
