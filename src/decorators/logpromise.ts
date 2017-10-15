import * as moment from 'moment';
import {APM} from '../APM';
import {ILogMessage, ILogOptions, LogLevel} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {convertLogArgs, convertLogResults, setApm, setLogOptions} from './utilities';



/**
 * log decorator for promise-based methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logpromise(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const apm: APM = setApm(provider);
    const opts: ILogOptions = setLogOptions(options);
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const name: string = [target.constructor.name, descriptor.value.name].join('.');
        const n = moment().toDate();
        const loglevel: LogLevel = (opts.logLevel && typeof(opts.logLevel) === 'function') ? opts.logLevel() : ((typeof(opts.logLevel) !== 'undefined') ? opts.logLevel : LogLevel.INFO);
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const result = originalMethod.apply(this, args);
            if (result && result.then) {
                return result.then((val: any) => {
                    const successMessage: ILogMessage = {
                        timestamp: n,
                        level: loglevel,
                        name,
                        args: convertLogArgs(opts.args, args),
                        results: convertLogResults(opts.results, val),
                        tags: opts.tags,
                    };
                    apm.sendLog(successMessage);
                    return val;
                }).catch((ex: any) => {
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
                });
            } else {
                const errorMessage: ILogMessage = {
                    timestamp: n,
                    level: LogLevel.ERROR,
                    name,
                    args: convertLogArgs(opts.args, args),
                    error: 'could not evaluate promise for ' + name,
                    tags: opts.tags,
                };
                apm.sendLog(errorMessage);
            }
        };
    };
}
/**
 * verbose logger decorator for promise-based methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logpromiseVerbose(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.VERBOSE;
    return logpromise(opts, provider);
}
/**
 * debug logger decorator for promise-based methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logpromiseDebug(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.DEBUG;
    return logpromise(opts, provider);
}
/**
 * information logger decorator for promise-based methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logpromiseInfo(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.INFO;
    return logpromise(opts, provider);
}
/**
 * warning logger decorator for promise-based methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logpromiseWarning(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.WARNING;
    return logpromise(opts, provider);
}
/**
 * error logger decorator for promise-based methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logpromiseError(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.ERROR;
    return logpromise(opts, provider);
}
/**
 * critical logger decorator for promise-based methods
 *
 * @export
 * @param {ILogOptions} [options]
 * @param {(Array<ISink>|APM|ISinkFunction)} [provider]
 * @returns
 */
export function logpromiseCritical(options?: ILogOptions, provider?: ISink[] | APM | ISinkFunction) {
    const opts: ILogOptions = setLogOptions(options);
    opts.logLevel = LogLevel.CRITICAL;
    return logpromise(opts, provider);
}
