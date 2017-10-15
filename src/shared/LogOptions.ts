import {ILogArgFormatterFunction, ILogLevelFunction, ILogResultFormatterFunction} from '../logging/ILoggingFunctions';
import {LogLevel, Tag} from '../shared';

/**
 * options for logging outputs
 *
 * @export
 * @type LogOptions
 */
export interface ILogOptions {
    /**
     * show arguments or function to format arguments prior to logging
     *
     * @type {boolean|ILogArgFormatterFunction}
     * @memberof LogOptions
     */
    args?: boolean | ILogArgFormatterFunction;
    /**
     * show results or function to format results prior to logging
     *
     * @type {boolean|ILogResultFormatterFunction}
     * @memberof LogOptions
     */
    results?: boolean | ILogResultFormatterFunction;
    /**
     * tags explicitly for logging
     *
     * @type {(Tag|Array<Tag>)}
     * @memberof LogOptions
     */
    tags?: Tag | Tag[];
    /**
     * current logging level or function to retrieve a log level
     *
     * @type {LogLevel|ILogLevelFunction}
     * @memberof LogOptions
     */
    logLevel?: LogLevel | ILogLevelFunction;
}
