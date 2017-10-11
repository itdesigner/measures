import {setApm, setLogOptions} from './utilities';
import {LogLevel, LogOptions, LogMessage, MeasureMessage, MeasureOptions} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {ITimerMeasure} from '../measures';
import {APM, defaultConsoleAPM} from '../APM';
import {isEmptyObject, convertLogArgs, convertLogResults} from './utilities';
import * as moment from 'moment';

/**
 * timer decorator for promise-based methods
 * 
 * @export
 * @param {string} [measureName] 
 * @param {MeasureOptions} [options] 
 * @returns 
 */
export function timerpromise(measureName?:string, options?:MeasureOptions, provider?:Array<ISink>|APM) {
    let apm = setApm(provider);
    let logOpts:LogOptions = (options) ? setLogOptions(options.log) : setLogOptions(undefined);
    let doLog:boolean = (options && options.log && !isEmptyObject(options.log)) ? true:false;
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        let name:string = (measureName)? measureName: [target.constructor.name, descriptor.value.name].join('.');
        let t:ITimerMeasure = apm.timeOperation(name,undefined, options);
        let n = moment().toDate();
        let loglevel:LogLevel = (logOpts.logLevel && typeof(logOpts.logLevel) === 'function') ? logOpts.logLevel() : ((typeof(logOpts.logLevel) !== 'undefined') ? logOpts.logLevel:LogLevel.DEBUG);
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            t.start();
            const result = originalMethod.apply(this, args);
            if (result && result.then) {
                return result.then((val:any) => {
                    t.stop();
                    if(doLog) {
                        let successMessage:LogMessage = {
                            timestamp:n,
                            level:loglevel,
                            name:name,
                            args:convertLogArgs(logOpts.args, args),
                            results:convertLogResults(logOpts.results, result),
                            tags:logOpts.tags
                        }
                        apm.sendLog(successMessage);
                    }
                    return val;
                }).catch((e: any) => {
                    t.stop();
                    if(doLog) {
                        let errorMessage:LogMessage = {
                            timestamp:n,
                            level:LogLevel.ERROR,
                            name:name,
                            args:convertLogArgs(logOpts.args, args),
                            error:e,
                            tags:logOpts.tags
                        }
                        apm.sendLog(errorMessage);
                    }
                    throw e;
                });
            } else {
                let errorMessage:LogMessage = {
                    timestamp:n,
                    level:LogLevel.ERROR,
                    name:name,
                    args:convertLogArgs(logOpts.args, args),
                    error:'could not evaluate promise for ' + name,
                    tags:logOpts.tags
                }
                apm.sendLog(errorMessage);
            }
        };
    };
}