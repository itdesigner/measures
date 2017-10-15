import {ILogMessage, IMeasureMessage} from '../shared';


export function instanceOfMeasureMessage(object: any): object is IMeasureMessage {
    return 'type' in object;
}
export function instanceOfLogMessage(object: any): object is ILogMessage {
    return 'level' in object;
}
