import {ILogLevelFunction} from '../logging';
import {ILogMessage, IMeasureMessage, LogLevel} from '../shared';
import {ILogFormatterFunction} from './ILogFormatter';
import {ISink} from './ISink';
import {instanceOfLogMessage} from './util';

/**
 * a Console APM Sink
 *
 * @export
 * @class ConsoleSink
 * @implements {ISink}
 */
export class ConsoleSink implements ISink {
    /**
     * any formatter supplied to enable transforms of sink measures
     *
     * @type {ILogFormatterFunction}
     * @memberof ConsoleSink
     */
    public formatter?: ILogFormatterFunction;
    /**
     * only logs at or higher than this level will be logged
     *
     * @type {LogLevel}
     * @memberof ConsoleSink
     */
    public logLevel: LogLevel | ILogLevelFunction;
    /**
     * Creates an instance of ConsoleSink.
     * @param {IFormatterFunction} [formatter]
     * @memberof ConsoleSink
     */
    constructor(logLevel: ILogLevelFunction | LogLevel = LogLevel.INFO, formatter?: ILogFormatterFunction) {
        this.formatter = formatter;
        this.logLevel = logLevel;
    }
    /**
     * the entry to push measures to the sink
     *
     * @param {*} result
     * @memberof ConsoleSink
     */
    public send(result: string | IMeasureMessage | ILogMessage): void {
        if (this.shouldSink(result)) {
            let r: any = result;
            if (this.formatter) {
                r = this.formatter(result);
                console.log(r);
            } else {
                console.log(JSON.stringify(r));
            }
        }
    }
    private shouldSink(item: any | IMeasureMessage | ILogMessage): boolean {
        let result: boolean = true;
        let thresholdLevel = this.logLevel;
        if (typeof(this.logLevel) === 'function') {
            thresholdLevel = this.logLevel();
        }
        if (typeof(item) !== 'string') {
            if (instanceOfLogMessage(item)) {
                if (item && item.level) {
                    const il = item.level;
                    if (il < thresholdLevel) {
                        result = false;
                    }
                }
            }
        }
        return result;
    }
}
