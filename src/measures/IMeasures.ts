import {MeasureType, Tag} from '../shared';

/**
 * base interface for measures
 *
 * @export
 * @interface IMeasure
 */
export interface IMeasure {
    type: MeasureType;
    name: string;
    correlationId: string;
    tags?: Tag | Tag[];
    write(): void;
}
/**
 * interface for counter-based measures
 *
 * @export
 * @interface ICounterMeasure
 * @extends {IMeasure}
 */
export interface ICounterMeasure extends IMeasure {
    count: number;
    increment(value?: number): void;
    decrement(value?: number): void;
    reset(): void;
}
/**
 * interface for meter-based measures
 *
 * @export
 * @interface IMeterMeasure
 * @extends {IMeasure}
 */
export interface IMeterMeasure extends IMeasure {
    count: number;
    mark(n: number): void;
}
/**
 * interface for timer-based measures
 *
 * @export
 * @interface ITimerMeasure
 * @extends {IMeasure}
 */
export interface ITimerMeasure extends IMeasure {
    start(): void;
    stop(): void;
}
/**
 * interface for histogram-based measures
 *
 * @export
 * @interface IHistogramMeasure
 * @extends {IMeasure}
 */
export interface IHistogramMeasure extends IMeasure {
    update(duration: number): void;
}
