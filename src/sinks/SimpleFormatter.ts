import * as moment from 'moment';
import {ILogMessage, IMeasureMessage, LogLevel, MeasureType} from '../shared';
import {instanceOfLogMessage} from './util';


export function simpleformat(item: string | ILogMessage | IMeasureMessage): string {
    let results = '';
    if (typeof(item) === 'string') {
        const now: string = moment().toISOString();
        results = `MESSAGE | ${now} | ${item}`;
    } else if (instanceOfLogMessage(item)) {
        const lm: {[k: string]: any} = {
            timestamp: moment(item.timestamp).toISOString(),
            name: item.name,
            level: LogLevel[item.level],
        };
        if (item.args) { lm.args = item.args; }
        if (item.results) { lm.results = item.results; }
        if (item.error) { lm.error = item.error; }
        if (item.message) { lm.message = item.message; }
        if (item.tags) { lm.tags = item.tags; }

        const stringItem: string = JSON.stringify(lm);
        results = `LOG | ${stringItem}`;
    } else {
        const mm: {[k: string]: any} = {
            name: item.name,
            type: MeasureType[item.type],
            timestamp: moment(item.timestamp).toISOString(),
        };
        if (item.value) { mm.value = item.value; }
        if (item.correlationId) { mm.correlationId = item.correlationId; }
        if (item.uom) { mm.uom = item.uom; }
        if (item.duration) { mm.duration = item.duration; }
        if (item.rate) { mm.rate = item.rate; }
        if (item.tags) { mm.tags = item.tags; }

        const stringItem: string = JSON.stringify(mm);
        results = `MEASURE | ${stringItem}`;
    }
    return results;
}
export default simpleformat;
