

/**
 * used to declare external health check and gauge functions
 * 
 * @export
 * @interface IOperationFunction
 */
export interface IOperationFunction {
    (): boolean | number;
}