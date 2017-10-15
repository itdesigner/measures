import {APM, defaultConsoleAPM} from '../APM';
import {ILogArgFormatterFunction, ILogResultFormatterFunction} from '../logging';
import { Counter, Meter, Timer} from '../measures';
import {ILogOptions, LogLevel, Tag} from '../shared';
import {ISink, ISinkFunction} from '../sinks';

export function setApm(provider?: ISink[] | APM | ISinkFunction): APM {
    let apm: APM;
    if (provider) {
        if (typeof(provider) === 'function') {
            return new APM(provider);
        } else if (Array.isArray(provider)) {
            return new APM(provider);
        } else if (provider instanceof APM) {
            apm = provider as APM;
        } else {
          throw new TypeError('provider is not an APM, SinkFunction, or Array of Sinks');
        }
    } else {
        apm = defaultConsoleAPM();
    }
    return apm;
}
export function setLogOptions(options?: ILogOptions): ILogOptions {
    const opts: ILogOptions = {
        args : (options && typeof(options.args) !== 'undefined') ? options.args : true,
        results : (options && typeof(options.results) !== 'undefined') ? options.results : true,
        logLevel : (options && typeof(options.logLevel) !== 'undefined') ? options.logLevel : LogLevel.INFO,
        tags : (options && options.tags) ? options.tags : new Array<Tag>(),
    };
    return opts;
}
export function convertLogArgs(opts: undefined | boolean | ILogArgFormatterFunction, args: any[]): string[] {
    let outresults: any[] = args;
    if (typeof(opts) !== 'undefined') {
        if (typeof(opts) === 'function') {
            outresults = opts(args);
        } else if (typeof(opts) === 'boolean') {
            if (opts === true) {
                outresults = args.map((arg) => JSON.stringify(arg));
            }
        }
    }
    return outresults;
}
export function convertLogResults(opts: undefined | boolean | ILogResultFormatterFunction, args: any): any {
    let outresults: any = args;
    if (typeof(opts) !== 'undefined') {
        if (typeof(opts) === 'function') {
            outresults = opts(args);
        } else if (typeof(opts) === 'boolean') {
            if (opts === true) {
                outresults = JSON.stringify(args);
            }
        }
    }
    return outresults;
}
export function isEmptyObject(obj: object) {
    for (const key in obj) {
        /* istanbul ignore else */
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

export function instanceOfMeter(object: any): object is Meter {
    if (object.type && object.type === 3) { return true; } else {return false; }
}
export function instanceOfCounter(object: any): object is Counter {
    if (object.type && object.type === 1) { return true; } else {return false; }
}
export function instanceOfTimer(object: any): object is Timer {
    if (object.type && object.type === 4) { return true; } else {return false; }
}

