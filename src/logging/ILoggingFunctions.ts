import * as Types from '../shared';

/**
 * a function that returns a LogLevel
 * 
 * @export
 * @interface ILogLevelFunction
 */
export interface ILogLevelFunction {
    (): Types.LogLevel;
}
/**
 * a function that accepts a set of arguments and enables reformatting prior to writing to logs
 * 
 * @export
 * @interface ILogArgFormatterFunction
 */
export interface ILogArgFormatterFunction {
    (...args: Array<any>): Array<any>;
}
/**
 * a function that accepts a single argument and enables reformatting prior to writing to logs
 * 
 * @export
 * @interface ILogResultFormatterFunction
 */
export interface ILogResultFormatterFunction {
    (args: any): any;
}
