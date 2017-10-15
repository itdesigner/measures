import * as moment from 'moment';
import {APM} from '../APM';
import {ITimerMeasure} from '../measures';
import {ILogMessage, ILogOptions, IMeasureOptions, LogLevel} from '../shared';
import {ISink} from '../sinks';
import {convertLogArgs, convertLogResults, isEmptyObject, setApm, setLogOptions} from './utilities';

/**
 * timer decorator for promise-based methods
 *
 * @export
 * @param {string} [measureName]
 * @param {IMeasureOptions} [options]
 * @returns
 */
export function timerpromise(measureName?: string, options?: IMeasureOptions, provider?: ISink[] | APM) {
    const apm = setApm(provider);
    const logOpts: ILogOptions = (options) ? setLogOptions(options.log) : setLogOptions(undefined);
    const doLog: boolean = (options && options.log && !isEmptyObject(options.log)) ? true : false;
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const name: string = (measureName) ? measureName : [target.constructor.name, descriptor.value.name].join('.');
        const t: ITimerMeasure = apm.timeOperation(name, undefined, options);
        const n = moment().toDate();
        const loglevel: LogLevel = (logOpts.logLevel && typeof(logOpts.logLevel) === 'function') ? logOpts.logLevel() : ((typeof(logOpts.logLevel) !== 'undefined') ? logOpts.logLevel : LogLevel.DEBUG);
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            t.start();
            const result = originalMethod.apply(this, args);
            if (result && result.then) {
                return result.then((val: any) => {
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
                    return val;
                }).catch((e: any) => {
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
                });
            } else {
                const errorMessage: ILogMessage = {
                    timestamp: n,
                    level: LogLevel.ERROR,
                    name,
                    args: convertLogArgs(logOpts.args, args),
                    error: 'could not evaluate promise for ' + name,
                    tags: logOpts.tags,
                };
                apm.sendLog(errorMessage);
            }
        };
    };
}
