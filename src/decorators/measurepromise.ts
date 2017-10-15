import {IMeasure} from '../measures';
import {MeasureType} from '../shared';
import {instanceOfCounter, instanceOfMeter, instanceOfTimer} from './utilities';

/**
 * generic measure decorator for promise-based methods
 *
 * @export
 * @param {IMeasure} [measure]
 * @returns
 */
export function measurepromise(measure: IMeasure) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]){
            try {
                triggerPreMeasure(measure);
                const result = originalMethod.apply(this, args);
                if (result && result.then) {
                    return result.then((val: any) => {
                        triggerPostMeasure(measure);
                        return val;
                    }).catch((ex: any) => {
                        triggerPostMeasure(measure);
                        throw ex;
                    });
                } else {
                    throw new Error('could not evaluate promise');
                }
            } catch (ex) {
                throw ex;
            }
        };
    };
}

function triggerPreMeasure(measure: IMeasure): void {
    switch (measure.type) {
        case MeasureType.Counter:
            /* istanbul ignore else */
            if (instanceOfCounter(measure)) { measure.increment(); }
            break;
        case MeasureType.Meter:
            /* istanbul ignore else */
            if (instanceOfMeter(measure)) { measure.mark(); }
            break;
        case MeasureType.Timer:
            /* istanbul ignore else */
            if (instanceOfTimer(measure)) { measure.start(); }
            break;
        default:
            measure.write();
            break;
    }
}
function triggerPostMeasure(measure: IMeasure): void {
    if (measure.type === MeasureType.Timer) {
        /* istanbul ignore else */
        if (instanceOfTimer(measure)) { measure.stop(); }
    }
}
