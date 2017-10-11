import {IMeterMeasure} from './IMeasures';
import {Tag, MeasureType, MeasureMessage, MeasureOptions} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {EWMA} from './utilities';
import * as moment from 'moment';


/**
 * Meter measure implementation
 * 
 * @export
 * @class Meter
 * @implements {IMeterMeasure}
 */
export class Meter implements IMeterMeasure{
    private _name:string;
    private _type:MeasureType;
    private _uom:string;
    private _count:number;
    private _correlationId:string;
    private _tags:Array<Tag>;

    private _startTime:any;
    private _m1Rate:EWMA;
    private _m5Rate:EWMA;
    private _m15Rate:EWMA;
    private _sinks: Array<ISink>|ISinkFunction;
    

    /**
     * Creates an instance of Meter.
     * @param {string} name 
     * @param {Array<ISink>|ISinkFunction} sinks 
     * @param {IOptions} [options] 
     * @memberof Meter
     */
    constructor(name:string, sinks:Array<ISink>|ISinkFunction, options?:MeasureOptions) {
        if(typeof(name) === 'undefined') { 
            throw Error('Invalid arguments: name is required');
        }
        if(typeof(sinks) === 'undefined') {
            throw Error('Invalid arguments: sinks are required');
        }
        this._name = name;
        this._type = MeasureType.Meter
        this._count = 0;
        this._m1Rate = EWMA.oneMinuteEWMA;
        this._m5Rate = EWMA.fiveMinuteEWMA;
        this._m15Rate = EWMA.fifteenMinuteEWMA;
        this._sinks = sinks;
        this._tags = new Array<Tag>();
        this.setOptions(options);
        this._startTime = (new Date).getTime();
    }

    /**
     * measure name
     * 
     * @readonly
     * @type {string}
     * @memberof Meter
     */
    get name():string {
        return this._name;
    }
    /**
     * measure type (MeasureType.Meter)
     * 
     * @readonly
     * @type {MeasureType}
     * @memberof Meter
     */
    get type():MeasureType {
        return this._type;
    }
    /**
     * current count of events
     * 
     * @readonly
     * @type {number}
     * @memberof Meter
     */
    get count():number {
        return this._count;
    }
    /**
     * unit of measure
     * 
     * @readonly
     * @type {string}
     * @memberof Meter
     */
    get uom():string {
        return this._uom;
    }
    /**
     * correlation id
     * 
     * @readonly
     * @type {string}
     * @memberof Meter
     */
    get correlationId():string {
        return this._correlationId;
    }
    get sinks():Array<ISink>|ISinkFunction {
        return this._sinks;
    }
    /**
     * tags collection associated with this measure
     * 
     * @readonly
     * @type {(Tag|Array<Tag>)}
     * @memberof Meter
     */
    get tags():Tag|Array<Tag> {
        if(typeof(this._tags)==='undefined') {
            return [];
        }
        return this._tags;
    }
    /**
     * the fifteen minute weighted rate
     * 
     * @readonly
     * @type {number}
     * @memberof Meter
     */
    get fifteenMinuteRate():number {
        return this._m15Rate.rate;
    }
    /**
     * the five minute weighted rate
     * 
     * @readonly
     * @type {number}
     * @memberof Meter
     */
    get fiveMinuteRate():number {
        return this._m5Rate.rate;
    }
    /**
     * the one minute weighted rate
     * 
     * @readonly
     * @type {number}
     * @memberof Meter
     */
    get oneMinuteRate():number {
        return this._m1Rate.rate;
    }
    /**
     * the mean rate
     * 
     * @readonly
     * @type {number}
     * @memberof Meter
     */
    get meanRate():number {
        return this._count / ((new Date).getTime() - this._startTime)*1000;
    }
    /**
     * retrieve all rates
     * 
     * @readonly
     * @type {*}
     * @memberof Meter
     */
    get rates():any {
        return {
            oneMinRate:this.oneMinuteRate, 
            fiveMinRate:this.fiveMinuteRate, 
            fifteenMinRate:this.fifteenMinuteRate, 
            mean:this.meanRate
        }; 
    }

    /**
     * used to add a sample
     * 
     * @param {number} [n=1] 
     * @memberof Meter
     */
    mark(n:number = 1):void {
        this._count += n;
        this._m1Rate.update(n);
        this._m5Rate.update(n);
        this._m15Rate.update(n);
    }
    /**
     * internal updater
     * 
     * @memberof Meter
     */
    private tick():void {
        this._m1Rate.tick();
        this._m5Rate.tick();
        this._m15Rate.tick();
    }
    
    /**
     * rites the current measure to any supplied ISink
     * 
     * @memberof Meter
     */
    write():void {
        let writeTags:Array<Tag> = this._tags;
        var r:MeasureMessage = {
            name:this._name, 
            type:this._type, 
            uom:this._uom, 
            value:{
                count:this._count, 
                mean:this.meanRate.toFixed(2), 
                oneMinRate:this.oneMinuteRate.toFixed(2), 
                fiveMinRate:this.fiveMinuteRate.toFixed(2), 
                fifteenMinRate:this.fifteenMinuteRate.toFixed(2) 
            }, 
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

    private setOptions(options:MeasureOptions|undefined):void {
        if(options) {
            this._correlationId = (options.correlationId) ? options.correlationId : '';
            this._tags = (options.tags) ? (Array.isArray(options.tags) ? options.tags : new Array<Tag>(<Tag>options.tags)) : new Array<Tag>();
            this._uom = (options.uom) ? options.uom : 'operation(s)';
        } else {
            this._correlationId = '';
            this._tags = new Array<Tag>();
            this._uom = 'operation(s)';
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

}