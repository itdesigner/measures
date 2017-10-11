import {MeasureType, Tag} from './types';

/**
 * default measure message structure
 * 
 * @export
 * @type MeasureMessage
 */
export type MeasureMessage = {
    /**
     * the type of measure
     * 
     * @type {MeasureType}
     */
    type:MeasureType;
    /**
     * the date when this event occurred
     * 
     * @type {Date}
     */
    timestamp:Date;
    /**
     * the name of measure
     * 
     * @type {string}
     */
    name:string;
    /**
     * the value of the measure
     * 
     * @type {*}
     */
    value?:any;
    /**
     * correlation id
     * 
     * @type {string}
     */
    correlationId?:string;
    /**
     * any tags associated with this measure
     * 
     * @type {(Tag|Array<Tag>)}
     */
    tags?:Tag|Array<Tag>;
    /**
     * unit of measure
     * 
     * @type {string}
     */
    uom?:string;
    /**
     * duration of the event
     * 
     * @type {*}
     */
    duration?:any;
    /**
     * the rate of the event
     * 
     * @type {number}
     */
    rate?:number;
}
