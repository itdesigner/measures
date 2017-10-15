import {ILogMessage, IMeasureMessage, Tag} from '../src/shared';

export function instanceOfLogMessage(object: any): object is ILogMessage {
    return 'level' in object;
}
export function instanceOfMeasureMessage(object: any): object is IMeasureMessage {
    return 'type' in object;
}

export function contains(a: any, obj: any) {
    for (const item of a) {
        if (item === obj) {
            return true;
        } else if (item.hasOwnProperty(obj)) {
            return true;
        }
    }
    return false;
}
export function findTag(a: Tag[], obj: any): Tag | undefined {
    for (const item of a) {
        if (item === obj) {
            return item;
        } else if (item.hasOwnProperty(obj)) {
            return item;
        }
    }
    return undefined;
}

export function sinkIsArray(s: any) {
    return Array.isArray(s);
}

export function sinkIsFunction(s: any) {
    if (typeof(s) === 'function') {
        return true;
    }
    return false;
}
