import {Tag, IKeyValueTag, LogMessage, MeasureMessage, MeasureType, LogLevel} from '../shared';
import {instanceOfLogMessage} from './util';
import * as moment from 'moment';


export function simpleformat(item:string|LogMessage|MeasureMessage):string {
    let results = '';
    if(typeof(item)==='string') {
        let now:string = moment().toISOString();
        results = `MESSAGE | ${now} | ${item}`;
    } else if(instanceOfLogMessage(item)){
        let lm:{[k:string]:any} = {
            timestamp: moment(item.timestamp).toISOString(),
            name: item.name,
            level:LogLevel[item.level]
        };
        if(item.args) { lm.args = item.args;}
        if(item.results) { lm.results = item.results;}
        if(item.error) { lm.error = item.error;}
        if(item.message) { lm.message = item.message;}
        if(item.tags) { lm.tags = item.tags;}
        
        let stringItem:string = JSON.stringify(lm);
        results = `LOG | ${stringItem}`;
    } else {
        //create some locals
        let mm:{[k:string]:any} = {
            name:item.name,
            type:MeasureType[item.type],
            timestamp:moment(item.timestamp).toISOString(),
        };
        if(item.value) { mm.value = item.value;}
        if(item.correlationId) { mm.correlationId = item.correlationId;}
        if(item.uom) { mm.uom = item.uom;}
        if(item.duration) { mm.duration = item.duration;}
        if(item.rate) { mm.rate = item.rate;}
        if(item.tags) { mm.tags = item.tags;}

        let stringItem:string = JSON.stringify(mm);
        results = `MEASURE | ${stringItem}`         
    }
    return results;
}
export default simpleformat
