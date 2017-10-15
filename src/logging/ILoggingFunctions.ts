import * as Types from '../shared';

/**
 * a function that returns a LogLevel
 *
 * @export
 * @interface ILogLevelFunction
 */
export type ILogLevelFunction = () => Types.LogLevel;
/**
 * a function that accepts a set of arguments and enables reformatting prior to writing to logs
 *
 * @export
 * @interface ILogArgFormatterFunction
 */
export type ILogArgFormatterFunction = (...args: any[]) => any[];
/**
 * a function that accepts a single argument and enables reformatting prior to writing to logs
 *
 * @export
 * @interface ILogResultFormatterFunction
 */
export type ILogResultFormatterFunction = (args: any) => any;
