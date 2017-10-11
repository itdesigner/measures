import {LogMessage, MeasureMessage} from '../shared';
import * as moment from 'moment';


export function instanceOfMeasureMessage(object: any): object is MeasureMessage {
    return 'type' in object;
}
export function instanceOfLogMessage(object: any): object is LogMessage {
    return 'level' in object;
}
