
/**
 * optional formatter interface which can be injected into the default sinks
 * 
 * @export
 * @interface ILogFormatterFunction
 */
export interface ILogFormatterFunction {
    (s:any): string;
}