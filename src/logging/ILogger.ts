import * as Types from '../shared';

/**
 * Interface for defining a loggers behavior
 *
 * @export
 * @interface ILogger
 */
export interface ILogger {
    /**
     * generic log method
     *
     * @param {Types.LogLevel} l
     * @param {*} m
     * @param {(Array<Types.Tag>|Types.Tag)} [t]
     * @memberof ILogger
     */
    log(l: Types.LogLevel, m: any, t?: Types.Tag[] | Types.Tag): void;
    /**
     * verbose log method
     *
     * @param {*} m
     * @param {(Array<Types.Tag>|Types.Tag)} [t]
     * @memberof ILogger
     */
    verbose(m: any, t?: Types.Tag[] | Types.Tag): void;
    /**
     * debug log method
     *
     * @param {*} m
     * @param {(Array<Types.Tag>|Types.Tag)} [t]
     * @memberof ILogger
     */
    debug(m: any, t?: Types.Tag[] | Types.Tag): void;
    /**
     * information log method
     *
     * @param {*} m
     * @param {(Array<Types.Tag>|Types.Tag)} [t]
     * @memberof ILogger
     */
    info(m: any, t?: Types.Tag[] | Types.Tag): void;
    /**
     * warning log method
     *
     * @param {*} m
     * @param {(Array<Types.Tag>|Types.Tag)} [t]
     * @memberof ILogger
     */
    warn(m: any, t?: Types.Tag[] | Types.Tag): void;
    /**
     * error log method
     *
     * @param {*} m
     * @param {*} [e]
     * @param {(Array<Types.Tag>|Types.Tag)} [t]
     * @memberof ILogger
     */
    error(m: any, e?: any, t?: Types.Tag[] | Types.Tag): void;
    /**
     * critical error log method
     *
     * @param {*} m
     * @param {*} [e]
     * @param {(Array<Types.Tag>|Types.Tag)} [t]
     * @memberof ILogger
     */
    critical(m: any, e?: any, t?: Types.Tag[] | Types.Tag): void;
}

