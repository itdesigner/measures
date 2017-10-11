import {
    IMeasure, 
    ITimerMeasure, 
    ICounterMeasure, 
    IMeterMeasure,
    IOperationFunction,
    Timer,
    Counter,
    Gauge,
    HealthCheck,
    Meter
} from './measures';
import {ILogger, Logger} from './logging';
import {MeasureOptions, Tag, LogLevel} from './shared';
import { ISink, ISinkFunction, ConsoleSink, ddformat, simpleformat} from './sinks';


/**
 * APM (Appliation Performance Monitoring) implementation
 * 
 * @export
 * @class APM
 */
export class APM {
    private _sinks:Array<ISink>|ISinkFunction;

    /**
     * Creates an instance of APM.
     * @param {Array<ISink>} [sinks=new Array<ISink>()] 
     * @memberof APM
     */
    constructor(sinks:Array<ISink>|ISinkFunction = new Array<ISink>()) {
        this._sinks = sinks;
    }

    /**
     * current sinks collection
     * 
     * @readonly
     * @type {Array<ISink>}
     * @memberof APM
     */
    get sinks():Array<ISink>|ISinkFunction {
        return this._sinks;
    }
    
    /**
     * retrieves a counter instance
     * 
     * @param {string} name 
     * @param {Array<ISink>} [sinks] 
     * @param {MeasureOptions} [options] 
     * @returns {ICounterMeasure} 
     * @memberof APM
     */
    countOperation(name:string, sinks?:Array<ISink>|ISinkFunction, options?:MeasureOptions):ICounterMeasure {
        return new Counter(name, this.getSinks(sinks), options);
    }
    /**
     * retrieves a gauge instance
     * 
     * @param {string} name 
     * @param {IOperationFunction} operation 
     * @param {Array<ISink>} [sinks] 
     * @param {MeasureOptions} [options] 
     * @returns {IMeasure} 
     * @memberof APM
     */
    gaugeOperation(name:string, operation:IOperationFunction, sinks?:Array<ISink>|ISinkFunction, options?:MeasureOptions):IMeasure {
        return new Gauge(name, this.getSinks(sinks),operation, options);
    }
    /**
     * retrieves a health check instance
     * 
     * @param {string} name 
     * @param {IOperationFunction} operation 
     * @param {Array<ISink>} [sinks] 
     * @param {MeasureOptions} [options] 
     * @returns {IMeasure} 
     * @memberof APM
     */
    healthOperation(name:string, operation:IOperationFunction, sinks?:Array<ISink>|ISinkFunction, options?:MeasureOptions):IMeasure {
        return new HealthCheck(name, this.getSinks(sinks),operation, options);
    }
    /**
     * retrieves a timer instance
     * 
     * @param {string} name 
     * @param {Array<ISink>} [sinks] 
     * @param {MeasureOptions} [options] 
     * @returns {ITimerMeasure} 
     * @memberof APM
     */
    timeOperation(name:string, sinks?:Array<ISink>|ISinkFunction, options?:MeasureOptions):ITimerMeasure {
        return new Timer(name, this.getSinks(sinks), options);
    }
    /**
     * retrieves a meter instance
     * 
     * @param {string} name 
     * @param {Array<ISink>} [sinks] 
     * @param {MeasureOptions} [options] 
     * @returns {IMeterMeasure} 
     * @memberof APM
     */
    meterOperation(name:string, sinks?:Array<ISink>|ISinkFunction, options?:MeasureOptions):IMeterMeasure {
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
    logger(context:string, sinks?:Array<ISink>|ISinkFunction, tags?:Tag|Array<Tag>):ILogger {
        return new Logger(context, this.getSinks(sinks), tags);
    }

    /**
     * sends string data to sinks
     * 
     * @param {string} arg 
     * @param {Array<ISink>} [sinks] 
     * @memberof APM
     */
    sendLog(arg:any, sinks?:Array<ISink>|ISinkFunction):void {
        let targetSinks:Array<ISink>|ISinkFunction = this.getSinks(sinks);
        if(typeof(targetSinks) === 'function') {
            targetSinks(arg);
        } else {
            for(let s of targetSinks) {
                s.send(arg);
            }
        }
    }
    private getSinks(sinks:Array<ISink> |ISinkFunction | undefined):Array<ISink>|ISinkFunction {
        if((typeof(sinks) === 'undefined') || (sinks.length==0)) {
            return this._sinks;
        } else {
            return sinks;
        }
    }

}

export function defaultConsoleAPM():APM {
    let defaultSink:ISink = new ConsoleSink(LogLevel.INFO, simpleformat);
    let sinks:Array<ISink> = new Array<ISink>(defaultSink);
    return new APM(sinks);
}
export function defaultDataDogAPM():APM {
    let defaultSink:ISink = new ConsoleSink(LogLevel.INFO, ddformat);
    let sinks:Array<ISink> = new Array<ISink>(defaultSink);
    return new APM(sinks);
}
export function defaultAPM():APM {
    let defaultSink:ISink = new ConsoleSink(LogLevel.INFO);
    let sinks:Array<ISink> = new Array<ISink>(defaultSink);
    return new APM(sinks);
}
