import {ILogger, Logger} from './logging';
import {
    Counter,
    Gauge,
    HealthCheck,
    ICounterMeasure,
    IMeasure,
    IMeterMeasure,
    IOperationFunction,
    ITimerMeasure,
    Meter,
    Timer,
} from './measures';
import {IMeasureOptions, LogLevel, Tag} from './shared';
import { ConsoleSink, ddformat, ISink, ISinkFunction, simpleformat} from './sinks';


/**
 * APM (Appliation Performance Monitoring) implementation
 *
 * @export
 * @class APM
 */
export class APM {
    private _sinks: ISink[] | ISinkFunction;

    /**
     * Creates an instance of APM.
     * @param {Array<ISink>} [sinks=new Array<ISink>()]
     * @memberof APM
     */
    constructor(sinks: ISink[] | ISinkFunction = new Array<ISink>()) {
        this._sinks = sinks;
    }

    /**
     * current sinks collection
     *
     * @readonly
     * @type {Array<ISink>}
     * @memberof APM
     */
    get sinks(): ISink[] | ISinkFunction {
        return this._sinks;
    }

    /**
     * retrieves a counter instance
     *
     * @param {string} name
     * @param {Array<ISink>} [sinks]
     * @param {IMeasureOptions} [options]
     * @returns {ICounterMeasure}
     * @memberof APM
     */
    public countOperation(name: string, sinks?: ISink[] | ISinkFunction, options?: IMeasureOptions): ICounterMeasure {
        return new Counter(name, this.getSinks(sinks), options);
    }
    /**
     * retrieves a gauge instance
     *
     * @param {string} name
     * @param {IOperationFunction} operation
     * @param {Array<ISink>} [sinks]
     * @param {IMeasureOptions} [options]
     * @returns {IMeasure}
     * @memberof APM
     */
    public gaugeOperation(name: string, operation: IOperationFunction, sinks?: ISink[] | ISinkFunction, options?: IMeasureOptions): IMeasure {
        return new Gauge(name, this.getSinks(sinks), operation, options);
    }
    /**
     * retrieves a health check instance
     *
     * @param {string} name
     * @param {IOperationFunction} operation
     * @param {Array<ISink>} [sinks]
     * @param {IMeasureOptions} [options]
     * @returns {IMeasure}
     * @memberof APM
     */
    public healthOperation(name: string, operation: IOperationFunction, sinks?: ISink[] | ISinkFunction, options?: IMeasureOptions): IMeasure {
        return new HealthCheck(name, this.getSinks(sinks), operation, options);
    }
    /**
     * retrieves a timer instance
     *
     * @param {string} name
     * @param {Array<ISink>} [sinks]
     * @param {IMeasureOptions} [options]
     * @returns {ITimerMeasure}
     * @memberof APM
     */
    public timeOperation(name: string, sinks?: ISink[] | ISinkFunction, options?: IMeasureOptions): ITimerMeasure {
        return new Timer(name, this.getSinks(sinks), options);
    }
    /**
     * retrieves a meter instance
     *
     * @param {string} name
     * @param {Array<ISink>} [sinks]
     * @param {IMeasureOptions} [options]
     * @returns {IMeterMeasure}
     * @memberof APM
     */
    public meterOperation(name: string, sinks?: ISink[] | ISinkFunction, options?: IMeasureOptions): IMeterMeasure {
        return new Meter(name, this.getSinks(sinks), options);
    }
    /**
     * retrieve a logger instance
     *
     * @param {string} context
     * @param {(Array<ISink>|ISinkFunction)} [sinks]
     * @param {(Tag|Array<Tag>)} [tags]
     * @returns {ILogger}
     * @memberof APM
     */
    public logger(context: string, sinks?: ISink[] | ISinkFunction, tags?: Tag | Tag[]): ILogger {
        return new Logger(context, this.getSinks(sinks), tags);
    }

    /**
     * sends string data to sinks
     *
     * @param {string} arg
     * @param {Array<ISink>} [sinks]
     * @memberof APM
     */
    public sendLog(arg: any, sinks?: ISink[] | ISinkFunction): void {
        const targetSinks: ISink[] | ISinkFunction = this.getSinks(sinks);
        if (typeof(targetSinks) === 'function') {
            targetSinks(arg);
        } else {
            for (const s of targetSinks) {
                s.send(arg);
            }
        }
    }
    private getSinks(sinks: ISink[] | ISinkFunction | undefined): ISink[] | ISinkFunction {
        if ((typeof(sinks) === 'undefined') || (sinks.length === 0)) {
            return this._sinks;
        } else {
            return sinks;
        }
    }

}

export function defaultConsoleAPM(): APM {
    const defaultSink: ISink = new ConsoleSink(LogLevel.INFO, simpleformat);
    const sinks: ISink[] = new Array<ISink>(defaultSink);
    return new APM(sinks);
}
export function defaultDataDogAPM(): APM {
    const defaultSink: ISink = new ConsoleSink(LogLevel.INFO, ddformat);
    const sinks: ISink[] = new Array<ISink>(defaultSink);
    return new APM(sinks);
}
export function defaultAPM(): APM {
    const defaultSink: ISink = new ConsoleSink(LogLevel.INFO);
    const sinks: ISink[] = new Array<ISink>(defaultSink);
    return new APM(sinks);
}
