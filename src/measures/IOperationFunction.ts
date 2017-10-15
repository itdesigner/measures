

/**
 * used to declare external health check and gauge functions
 *
 * @export
 * @interface IOperationFunction
 */
export type IOperationFunction = () => boolean | number;
