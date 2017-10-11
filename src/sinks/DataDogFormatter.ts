import {Tag, IKeyValueTag, LogMessage, MeasureMessage, MeasureType} from '../shared';
import {instanceOfLogMessage} from './util';
import * as moment from 'moment';

function toArray<T> (val?: T | T[]): T[] {
    return Array.isArray(val) ? val : typeof val === 'undefined' ? [] : [val]
}
function logValue(val: any): string {
    return typeof val === 'undefined' ? 'undefined' : val.toString()
}

function logKeyValue(val: IKeyValueTag): string {
    return Object.getOwnPropertyNames(val).map(function (key) {
        return `${key}:${logValue(val[key])}`
    }).join(',')
}

function isKeyValueTag(tag: Tag): tag is IKeyValueTag {
    return typeof tag === 'object'
}

function logTags(tags: Tag[]): string {
    const values = tags.map<any>(function (t: Tag) {
        return isKeyValueTag(t) ? logKeyValue(t) : logValue(t)
    }).join(',')
    return values.length ? `|#${values}` : ''
}
export function ddformat(item:any):string {
    let results = '';
    if(typeof(item)==='string') {
        let now:string = moment().toISOString();
        results = `MESSAGE | ${now} | ${item}`;
    } else if(instanceOfLogMessage(item)){
        let stringItem:string = JSON.stringify(item);
        results = `LOG | ${stringItem}`;
    } else {
        //create some locals
        let epoch:number = Math.round(item.timestamp.valueOf()/1000);
        let measureName:string = item.name;
        let type:string = MeasureType[item.type].toLowerCase();
        let t:Array<Tag> = toArray<Tag>(item.tags);
        let metricValue:number=0;
        let v = item.value;
        let tp = item.type;
        switch(tp) {
            case MeasureType.Health:
                metricValue = (v);
                break;
            case MeasureType.Meter:
                metricValue = (v.mean);
                t.push({'count':v.count}, {'oneMinRate':v.oneMinRate}, {'fiveMinRate':v.fiveMinRate}, {'fifteenMinRate':v.fifteenMinRate});
                break;
            default:
                metricValue = (item.value).toFixed(4);
                break;
        }
        let tags:string = logTags(t);
        
        results = `MONITORING|${epoch}|${metricValue}|${type}|${measureName}${tags}`;            
    }

    //let statement:string = `MONITORING|${epoch}|${metricValue}|${type}|${metricName}${labels}`

    return results;
}
export default ddformat
