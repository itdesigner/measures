import {LogLevel, Tag} from './types'

/**
 * default logging structure
 * 
 * @export
 * @type LogMessage
 */
export type LogMessage = {
    /**
     * log time
     * 
     * @type {string}
     * @memberof LogMessage
     */
    timestamp:Date;
    /**
     * name of method being logged
     * 
     * @type {string}
     * @memberof LogMessage
     */
    name:string;
    /**
     * current log level
     * 
     * @type {LogLevel}
     * @memberof LogMessage
     */
    level:LogLevel;
    /**
     * arguments to logged method
     * 
     * @type {Array<any>}
     * @memberof LogMessage
     */
    args?:Array<any>;
    /**
     * results of logged method
     * 
     * @type {Array<any>}
     * @memberof LogMessage
     */
    results?:Array<any>;
    /**
     * any errors from method
     * 
     * @type {*}
     * @memberof LogMessage
     */
    error?:any;
    /**
     * any arbitrary message
     * 
     * @type {*}
     * @memberof LogMessage
     */
    message?:any;
    /**
     * tags associated with the logger
     * 
     * @type {(Tag|Array<Tag>)}
     * @memberof LogMessage
     */
    tags?:Tag|Array<Tag>;
}
