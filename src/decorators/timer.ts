import * as moment from 'moment';
import {APM} from '../APM';
import {ITimerMeasure} from '../measures';
import {ILogMessage, ILogOptions, IMeasureOptions, LogLevel} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {convertLogArgs, convertLogResults, isEmptyObject, setApm, setLogOptions} from './utilities';

/**
 * timer decorator for synchronous methods
 *
 * @export
 * @param {string} [measureName]
 * @param {ILogOptions} [options]
 * @returns
 */
export function timer(measureName?: string, options?: IMeasureOptions, provider?: ISink[] | APM | ISinkFunction) {
    const apm = setApm(provider);
    const logOpts: ILogOptions = (options) ? setLogOptions(options.log) : setLogOptions(undefined);
    const doLog: boolean = (options && options.log && !isEmptyObject(options.log)) ? true : false;
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const name: string = (measureName) ? measureName : [target.constructor.name, descriptor.value.name].join('.');
        const t: ITimerMeasure = apm.timeOperation(name, undefined, options);
        const n = moment().toDate();
        const loglevel: LogLevel = (logOpts.logLevel && typeof(logOpts.logLevel) === 'function') ? logOpts.logLevel() : ((typeof(logOpts.logLevel) !== 'undefined') ? logOpts.logLevel : LogLevel.DEBUG);
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]){
            t.start();
            try {
                const result = originalMethod.apply(this, args);
                t.stop();
                if (doLog) {
                    const successMessage: ILogMessage = {
                        timestamp: n,
                        level: loglevel,
                        name,
                        args: convertLogArgs(logOpts.args, args),
                        results: convertLogResults(logOpts.results, result),
                        tags: logOpts.tags,
                    };
                    apm.sendLog(successMessage);
                }
                return result;
            } catch (e) {
                t.stop();
                if (doLog) {
                    const errorMessage: ILogMessage = {
                        timestamp: n,
                        level: LogLevel.ERROR,
                        name,
                        args: convertLogArgs(logOpts.args, args),
                        error: e,
                        tags: logOpts.tags,
                    };
                    apm.sendLog(errorMessage);
                }
                throw e;
            }
        };
        return descriptor;
    };
}
