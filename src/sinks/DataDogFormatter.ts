import * as moment from 'moment';
import {IKeyValueTag, MeasureType, Tag} from '../shared';
import {instanceOfLogMessage} from './util';

function toArray<T>(val?: T | T[]): T[] {
    return Array.isArray(val) ? val : typeof val === 'undefined' ? [] : [val];
}
function logValue(val: any): string {
    return typeof val === 'undefined' ? 'undefined' : val.toString();
}

function logKeyValue(val: IKeyValueTag): string {
    return Object.getOwnPropertyNames(val).map(function(key) {
        return `${key}:${logValue(val[key])}`;
    }).join(',');
}

function isKeyValueTag(tag: Tag): tag is IKeyValueTag {
    return typeof tag === 'object';
}

function logTags(tags: Tag[]): string {
    const values = tags.map<any>(function(t: Tag) {
        return isKeyValueTag(t) ? logKeyValue(t) : logValue(t);
    }).join(',');
    return values.length ? `|#${values}` : '';
}
export function ddformat(item: any): string {
    let results = '';
    if (typeof(item) === 'string') {
        const now: string = moment().toISOString();
        results = `MESSAGE | ${now} | ${item}`;
    } else if (instanceOfLogMessage(item)) {
        const stringItem: string = JSON.stringify(item);
        results = `LOG | ${stringItem}`;
    } else {
        const epoch: number = Math.round(item.timestamp.valueOf() / 1000);
        const measureName: string = item.name;
        const type: string = MeasureType[item.type].toLowerCase();
        const t: Tag[] = toArray<Tag>(item.tags);
        let metricValue: number = 0;
        const v = item.value;
        const tp = item.type;
        switch (tp) {
            case MeasureType.Health:
                metricValue = (v);
                break;
            case MeasureType.Meter:
                metricValue = (v.mean);
                t.push({count: v.count}, {oneMinRate: v.oneMinRate}, {fiveMinRate: v.fiveMinRate}, {fifteenMinRate: v.fifteenMinRate});
                break;
            default:
                metricValue = (item.value).toFixed(4);
                break;
        }
        const tags: string = logTags(t);

        results = `MONITORING|${epoch}|${metricValue}|${type}|${measureName}${tags}`;
    }
    return results;
}
export default ddformat;
