import {ISink, ISinkFunction} from '../sinks';
import {APM, defaultConsoleAPM} from '../APM';
import {LogOptions, LogMessage, Tag, LogLevel} from '../shared';
import {ILogArgFormatterFunction, ILogLevelFunction, ILogResultFormatterFunction, ILogger} from '../logging';
import { Meter, Counter, Timer} from '../measures';

export function setApm(provider?:Array<ISink>|APM|ISinkFunction):APM {
    let apm:APM;
    if(provider) {
        if(typeof(provider) === 'function') {
            apm = new APM(provider);
        } else if (Array.isArray(provider)) {
            apm = new APM(provider);
        } else {
            apm = <APM>provider;
        }
    }
    else {
        apm = defaultConsoleAPM();
    }
    return apm;
}
export function setLogOptions(options?:LogOptions):LogOptions {
    let opts:LogOptions = {
        args : (options && typeof(options.args) !== 'undefined') ? options.args : true,
        results : (options && typeof(options.results) !== 'undefined') ? options.results : true,
        logLevel : (options && typeof(options.logLevel) !== 'undefined') ? options.logLevel : LogLevel.INFO,
        tags : (options && options.tags) ? options.tags : new Array<Tag>()
    } 
    return opts;
}
export function convertLogArgs(opts:undefined|boolean|ILogArgFormatterFunction, args:Array<any>):Array<string> {
    let outresults:Array<any> = new Array<any>();
    if(opts) {
        if(typeof(opts) === 'function') {
            outresults = opts(args);
        } else if(typeof(opts) === 'boolean') {
            if(opts === true) {
                outresults = args.map(arg=>JSON.stringify(arg));
            }
        }
    }
    return outresults;
}
export function convertLogResults(opts:undefined|boolean|ILogResultFormatterFunction, args:any):any {
    let outresults:any={};
    if(opts) {
        if(typeof(opts) === 'function') {
            outresults = opts(args);
        } else if(typeof(opts) === 'boolean') {
            if(opts === true) {
                outresults = JSON.stringify(args);
            }
        }
    }
    return outresults;
}
export function isEmptyObject(obj:object) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function instanceOfMeter(object: any): object is Meter {
    return 'level' in object;
}
export function instanceOfCounter(object: any): object is Counter {
    return 'level' in object;
}
export function instanceOfTimer(object: any): object is Timer {
    return 'level' in object;
}

