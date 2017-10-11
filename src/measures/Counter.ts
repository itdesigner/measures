import {ICounterMeasure} from './IMeasures';
import {MeasureType, Tag, MeasureMessage, MeasureOptions} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import * as moment from 'moment';


/**
 * Counter measure implemtation
 * 
 * @export
 * @class Counter
 * @implements {ICounterMeasure}
 */
export class Counter implements ICounterMeasure {
    static max_counter_value:number = Math.pow(2,32);
    private _type:MeasureType;
    private _name:string;
    private _count:number;
    private _resolution:number;
    private _iterations:number;
    private _uom:string;
    private _directWrite:boolean;
    private _sinks:Array<ISink>|ISinkFunction
    private _correlationId:string;
    private _tags:Array<Tag>;

   /**
    * Creates an instance of Counter.
    * @param {string} name 
    * @param {Array<ISink>|ISinkFunction} sinks 
    * @param {IOptions} [options] 
    * @memberof Counter
    */
   constructor(name:string, sinks:Array<ISink>|ISinkFunction, options?:MeasureOptions) {
        if(typeof(name) === 'undefined') { 
            throw Error('Invalid arguments: name is required');
        }
        if(typeof(sinks) === 'undefined') {
            throw Error('Invalid arguments: sinks are required');
        }
        this._name = name;
        this._count=0;
        this._type = MeasureType.Counter;
        this._sinks = sinks;
        this._iterations=0; 
        this._tags = new Array<Tag>();
        this.setOptions(options);
    }
    /**
     * measure name
     * 
     * @readonly
     * @type {string}
     * @memberof Counter
     */
    get name():string {
        return this._name;
    }
    /**
     * the count total
     * 
     * @readonly
     * @type {number}
     * @memberof Counter
     */
    get count():number {
        return this._count;
    }
    /**
     * unit of measure
     * 
     * @readonly
     * @type {string}
     * @memberof Counter
     */
    get uom():string {
        return this._uom;
    }
    /**
     * type of measure (MetricType.Counter)
     * 
     * @readonly
     * @type {MeasureType}
     * @memberof Counter
     */
    get type():MeasureType {
        return this._type;
    }
    /**
     * the correlation id
     * 
     * @readonly
     * @type {string}
     * @memberof Counter
     */
    get correlationId():string {
        return this._correlationId;
    }
    /**
     * the resolution for writes
     * 
     * @readonly
     * @type {number}
     * @memberof Counter
     */
    get resolution():number {
        return this._resolution;
    }
    /**
     * the tag collection for this measure
     * 
     * @readonly
     * @type {(Tag|Array<Tag>)}
     * @memberof Counter
     */
    get tags():Tag|Array<Tag> {
        if(typeof(this._tags)==='undefined') {
            return [];
        }
        return this._tags;
    }
    get directWrite():boolean {
        return this._directWrite;
    }
    get sinks():Array<ISink>|ISinkFunction {
        return this._sinks;
    }

    private setOptions(options:MeasureOptions|undefined):void {
        if(options) {
            this._correlationId = (options.correlationId) ? options.correlationId : '';
            this._tags = (options.tags) ? ((Array.isArray(options.tags)) ? options.tags : new Array<Tag>(<Tag>options.tags)) : new Array<Tag>();
            this._uom = (options.uom) ? options.uom : 'operation(s)';
            this._directWrite = (typeof(options.directWrite)!=='undefined' && options.directWrite !==null) ? options.directWrite : true;
            this._resolution = (options.resolution) ? options.resolution : 1;
        } else {
            this._correlationId = '';
            this._tags = new Array<Tag>();
            this._uom = 'operation(s)';
            this._directWrite = true;
            this._resolution = 1;
        }
    }
    private addTag(tags:Array<Tag>, k:string, v:string|number|boolean):void {
        if(!this.contains(tags,k)) {
            tags.push(JSON.parse(`{"${k}":"${v}"}`));
        }
    }
    private contains(a:Array<Tag>, obj:string) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            } else if(a[i].hasOwnProperty(obj)) {
                return true;
            }
        }
        return false;
    }

    /**
     * increment the counter
     * 
     * @param {number} [value=1] 
     * @memberof Counter
     */
    increment(value:number = 1):void {
        this._count+=value;
        this._iterations++;
        this.validateRange();
        if(this._directWrite && (this._iterations % this._resolution)==0) {
            this.write();
        }
    }
    /**
     * decrement the counter
     * 
     * @param {number} [value=1] 
     * @memberof Counter
     */
    decrement(value:number = 1):void {
        this._count-=value;
        this._iterations++;
        this.validateRange();
        if(this._directWrite && (this._iterations % this._resolution)==0) {
            this.write();
        }
    }
    /**
     * reset the counter
     * 
     * @memberof Counter
     */
    reset():void {
        this._count=0;
        this._iterations++;
        if(this._directWrite && (this._iterations % this._resolution)==0) {
            this.write();
        }
    }
    /**
     * writes the measure value to the sink
     * 
     * @memberof Counter
     */
    write():void {
        let writeTags:Array<Tag> = this._tags;
        var r:MeasureMessage = {
            name:this._name, 
            type:this._type,
            uom:this._uom, 
            value:this._count, 
            timestamp: moment().toDate(), 
            correlationId:this._correlationId, 
            tags:writeTags
        };
        if(typeof(this._sinks) === 'function'){
            this._sinks(r);
        } else {
            for(let s of this._sinks) {
                s.send(r);
            }
        }
    }
    private validateRange():void {
        if(this._count<0) { 
            this._count = 0;
        } else if(this._count > Counter.max_counter_value) {
            this._count -=(Counter.max_counter_value + 1);
        }
    }
}