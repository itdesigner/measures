import {LogOptions, LogLevel, LogMessage} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {APM} from '../APM';
import {setApm, setLogOptions, convertLogArgs, convertLogResults} from './utilities';
import * as moment from 'moment';

/**
 * log decorator for synchronous operations
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function log(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let apm:APM=setApm(provider);
    let opts:LogOptions = setLogOptions(options);
    return (target:Object, propertyKey:string, descriptor:TypedPropertyDescriptor<any>) => {
        let name:string = [target.constructor.name, descriptor.value.name].join('.');
        let n = moment().toDate();
        let loglevel:LogLevel = (opts.logLevel && typeof(opts.logLevel) === 'function') ? opts.logLevel() : ((typeof(opts.logLevel) !== 'undefined') ? opts.logLevel:LogLevel.INFO);
        const originalMethod =descriptor.value;
        descriptor.value = function(...args:any[]){
            try {
                const result = originalMethod.apply(this, args);
                let successMessage:LogMessage = {
                    timestamp:n,
                    level:loglevel,
                    name:name,
                    args:convertLogArgs(opts.args, args),
                    results:convertLogResults(opts.results, result),
                    tags:opts.tags
                }
                apm.sendLog(successMessage);
                return result;
            } catch (ex) {
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
            }
        };
        return descriptor;
    };
}
/**
 * verbose logger decorator for synchronous methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logVerbose(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction){
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.VERBOSE;
    return log(opts, provider);
}
/**
 * debug logger decorator for synchronous methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logDebug(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.DEBUG;
    return log(opts, provider);
}
/**
 * information logger decorator for synchronous methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logInfo(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.INFO;
    return log(opts, provider);
}
/**
 * warning logger decorator for synchronous methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logWarning(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.WARNING;
    return log(opts, provider);
}
/**
 * error logger decorator for synchronous methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logError(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.ERROR;
    return log(opts, provider);
}
/**
 * critical logger decorator for synchronous methods
 * 
 * @export
 * @param {LogOptions} [options] 
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider] 
 * @returns 
 */
export function logCritical(options?:LogOptions, provider?:Array<ISink>|APM|ISinkFunction) {
    let opts:LogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.CRITICAL;
    return log(opts, provider);
}

