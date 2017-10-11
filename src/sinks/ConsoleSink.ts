import {ISink} from './ISink';
import {ILogFormatterFunction} from './ILogFormatter';
import {Tag, LogMessage, MeasureMessage, LogLevel} from '../shared';
import {instanceOfLogMessage, instanceOfMeasureMessage} from './util'
import {ILogLevelFunction} from '../logging';
import * as moment from 'moment';

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
    formatter?:ILogFormatterFunction;
    /**
     * only logs at or higher than this level will be logged
     * 
     * @type {LogLevel}
     * @memberof ConsoleSink
     */
    logLevel:LogLevel|ILogLevelFunction;
    /**
     * Creates an instance of ConsoleSink.
     * @param {IFormatterFunction} [formatter] 
     * @memberof ConsoleSink
     */
    constructor(logLevel:ILogLevelFunction|LogLevel = LogLevel.INFO, formatter?:ILogFormatterFunction) {
        this.formatter = formatter;
        this.logLevel = logLevel;
    }
    /**
     * the entry to push measures to the sink
     * 
     * @param {*} result 
     * @memberof ConsoleSink
     */
    send(result:string|MeasureMessage|LogMessage):void {
        if(this.shouldSink(result)){
            let r:any=result;
            if(this.formatter) {
                r=this.formatter(result);
                console.log(r);
            } else {
                console.log(JSON.stringify(r));
            }
        }
    }
    private shouldSink(item:any|MeasureMessage|LogMessage):boolean {
        let result:boolean = true;
        let thresholdLevel = this.logLevel;
        if(typeof(this.logLevel) == 'function') {
            thresholdLevel = this.logLevel();
        }
        if(typeof(item) !== 'string') {
            if(instanceOfLogMessage(item)) {
                if(item && item.level) {
                    let il = item.level;
                    if(il < thresholdLevel) {
                        result = false;
                    }
                }
            } 
        }
        return result;
    }
}