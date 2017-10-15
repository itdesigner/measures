import {LogLevel, Tag} from './types';

/**
 * default logging structure
 *
 * @export
 * @type LogMessage
 */
export interface ILogMessage {
    /**
     * log time
     *
     * @type {string}
     * @memberof LogMessage
     */
    timestamp: Date;
    /**
     * name of method being logged
     *
     * @type {string}
     * @memberof LogMessage
     */
    name: string;
    /**
     * current log level
     *
     * @type {LogLevel}
     * @memberof LogMessage
     */
    level: LogLevel;
    /**
     * arguments to logged method
     *
     * @type {Array<any>}
     * @memberof LogMessage
     */
    args?: any[];
    /**
     * results of logged method
     *
     * @type {any}
     * @memberof LogMessage
     */
    results?: any;
    /**
     * any errors from method
     *
     * @type {*}
     * @memberof LogMessage
     */
    error?: any;
    /**
     * any arbitrary message
     *
     * @type {*}
     * @memberof LogMessage
     */
    message?: any;
    /**
     * tags associated with the logger
     *
     * @type {(Tag|Array<Tag>)}
     * @memberof LogMessage
     */
    tags?: Tag | Tag[];
}
