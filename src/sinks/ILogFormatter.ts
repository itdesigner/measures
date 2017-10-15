
/**
 * optional formatter interface which can be injected into the default sinks
 *
 * @export
 * @interface ILogFormatterFunction
 */
export type ILogFormatterFunction = (s: any) => string;
