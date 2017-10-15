import * as Logging from '../logging';
import * as Types from '../shared';

/**
 * Sink Interface
 *
 * @export
 * @interface ISink
 */
export interface ISink {
    /**
     * lowest log level that this will sink
     *
     * @type {(Types.LogLevel | Logging.ILogLevelFunction)}
     * @memberof ISink
     */
    logLevel: Types.LogLevel | Logging.ILogLevelFunction;
    /**
     * accepts messages / objects to sink / send
     *
     * @param {*} item
     * @memberof ISink
     */
    send(item: any): void;
}

/**
 * sink function definiton
 *
 * @export
 * @interface ISinkFunction
 */
export type ISinkFunction = (s: any) => void;
