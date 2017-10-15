import * as moment from 'moment';
import {APM} from '../APM';
import {ILogMessage, ILogOptions, LogLevel} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {convertLogArgs, convertLogResults, setApm, setLogOptions} from './utilities';

/**
 * log decorator for synchronous operations
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function log(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const apm: APM = setApm(provider);
    const opts: ILogOptions = setLogOptions(options);
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const name: string = [target.constructor.name, descriptor.value.name].join('.');
        const n = moment().toDate();
        const loglevel: LogLevel = (opts.logLevel && typeof(opts.logLevel) === 'function') ? opts.logLevel() : ((typeof(opts.logLevel) !== 'undefined') ? opts.logLevel : LogLevel.INFO);
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]){
            try {
                const result = originalMethod.apply(this, args);
                const successMessage: ILogMessage = {
                    timestamp: n,
                    level: loglevel,
                    name,
                    args: convertLogArgs(opts.args, args),
                    results: convertLogResults(opts.results, result),
                    tags: opts.tags,
                };
                apm.sendLog(successMessage);
                return result;
            } catch (ex) {
                const errorMessage: ILogMessage = {
                    timestamp: n,
                    level: LogLevel.ERROR,
                    name,
                    args: convertLogArgs(opts.args, args),
                    error: ex,
                    tags: opts.tags,
                };
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
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logVerbose(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.VERBOSE;
    return log(opts, provider);
}
/**
 * debug logger decorator for synchronous methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logDebug(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.DEBUG;
    return log(opts, provider);
}
/**
 * information logger decorator for synchronous methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logInfo(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.INFO;
    return log(opts, provider);
}
/**
 * warning logger decorator for synchronous methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logWarning(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.WARNING;
    return log(opts, provider);
}
/**
 * error logger decorator for synchronous methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logError(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.ERROR;
    return log(opts, provider);
}
/**
 * critical logger decorator for synchronous methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logCritical(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.CRITICAL;
    return log(opts, provider);
}

