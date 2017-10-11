import {LogOptions, LogLevel, LogMessage} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {APM} from '../APM';
import {setApm, setLogOptions, convertLogArgs, convertLogResults} from './utilities';
import * as moment from 'moment';



/**
 * log decorator for promise-based methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logpromise(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let apm:APM=setApm(provider);
    let opts:LogOptions = setLogOptions(options);
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        let name:string = [target.constructor.name, descriptor.value.name].join('.');
        let n = moment().toDate();
        let loglevel:LogLevel = (opts.logLevel && typeof(opts.logLevel) === 'function') ? opts.logLevel() : ((typeof(opts.logLevel) !== 'undefined') ? opts.logLevel:LogLevel.INFO);
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const result = originalMethod.apply(this, args);
            if (result && result.then) {
                return result.then((val:any) => {
                    let successMessage:LogMessage = {
                        timestamp:n,
                        level:loglevel,
                        name:name,
                        args:convertLogArgs(opts.args, args),
                        results:convertLogResults(opts.results, result),
                        tags:opts.tags
                    }
                    apm.sendLog(successMessage);
                    return val;
                }).catch((ex:any) => {
                    let errorMessage:LogMessage = {
                        timestamp:n,
                        level:LogLevel.ERROR,
                        name:name,
                        args:convertLogArgs(opts.args, args),
                        error:ex,
                        tags:opts.tags
                    }
                    apm.sendLog(errorMessage);
                    throw ex;
                });
            } else {
                let errorMessage:LogMessage = {
                    timestamp:n,
                    level:LogLevel.ERROR,
                    name:name,
                    args:convertLogArgs(opts.args, args),
                    error:'could not evaluate promise for ' + name,
                    tags:opts.tags
                }
                apm.sendLog(errorMessage);
            }
        };
    };
}
/**
 * verbose logger decorator for promise-based methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logpromiseVerbose(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction){
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.VERBOSE;
    return logpromise(opts, provider);
}
/**
 * debug logger decorator for promise-based methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logpromiseDebug(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts: LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.DEBUG;
    return logpromise(opts, provider);
}
/**
 * information logger decorator for promise-based methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logpromiseInfo(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.INFO;
    return logpromise(opts, provider);
}
/**
 * warning logger decorator for promise-based methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logpromiseWarning(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.WARNING;
    return logpromise(opts, provider);
}
/**
 * error logger decorator for promise-based methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logpromiseError(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.ERROR;
    return logpromise(opts, provider);
}
/**
 * critical logger decorator for promise-based methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logpromiseCritical(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.CRITICAL;
    return logpromise(opts, provider);
}
