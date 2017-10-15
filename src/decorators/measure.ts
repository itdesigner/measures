import {IMeasure} from '../measures';
import {MeasureType} from '../shared';
import {instanceOfCounter, instanceOfMeter, instanceOfTimer} from './utilities';

/**
 * generic measure decorator for synchronous methods
 *
 * @export
 * @param {IMeasure} [externalMeasure]
 * @returns
 */
export function measure(externalMeasure: IMeasure) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]){
            try {
                triggerPreMeasure(externalMeasure);
                const result = originalMethod.apply(this, args);
                triggerPostMeasure(externalMeasure);
                return result;
            } catch (e) {
                triggerPostMeasure(externalMeasure);
                throw e;
            }
        };
        return descriptor;
    };
}

function triggerPreMeasure(externalMeasure: IMeasure): void {
    switch (externalMeasure.type) {
        case MeasureType.Counter:
            /* istanbul ignore else */
            if (instanceOfCounter(externalMeasure)) { externalMeasure.increment(); }
            break;
        case MeasureType.Meter:
            /* istanbul ignore else */
            if (instanceOfMeter(externalMeasure)) { externalMeasure.mark(); }
            break;
        case MeasureType.Timer:
            /* istanbul ignore else */
            if (instanceOfTimer(externalMeasure)) { externalMeasure.start(); }
            break;
        default:
            externalMeasure.write();
            break;
    }
}
function triggerPostMeasure(externalMeasure: IMeasure): void {
    if (externalMeasure.type === MeasureType.Timer) {
        /* istanbul ignore else */
        if (instanceOfTimer(externalMeasure)) { externalMeasure.stop(); }
    }
}
