import {ITimerMeasure} from './IMeasures';
import {MeasureType, Tag, MeasureMessage, MeasureOptions} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {StopWatch, CpuState, MemoryState, getCpu, getMemory, averageCpu} from './utilities';
import * as moment from 'moment';

/**
 * Timer measure implementation
 * 
 * @export
 * @class Timer
 * @implements {ITimerMeasure}
 */
export class Timer implements ITimerMeasure {
    private _type:MeasureType;
    private _name:string;
    private _correlationId:string;
    private _sinks:Array<ISink>|ISinkFunction;
    private _tags:Array<Tag>;
    private _active:boolean;

    private _showCpu:boolean;
    private _showMemory:boolean;

    private _startCpuAve:any;
    private _elapsed:number;
    private _watch:StopWatch;

    /**
     * Creates an instance of Timer.
     * @param {string} name name of the measure
     * @param {Array<ISink>|ISinkFunction} sinks the sink(s) that the measure should send the timer results to
     * @param {string} [correlationId=''] 
     * @param {(Tag|Array<Tag>)} [tags] 
     * @memberof Timer
     */
    constructor(name:string, sinks:Array<ISink>|ISinkFunction, options?:MeasureOptions) {
        if(typeof(name) === 'undefined') { 
            throw Error('Invalid arguments: name is required');
        }
        if(typeof(sinks) === 'undefined') {
            throw Error('Invalid arguments: sinks are required');
        }
        this._name = name;
        this._type = MeasureType.Timer;
        this._sinks = sinks;
        this._tags = new Array<Tag>();
        this.setOptions(options);
        this._active = false;
    }
    /**
     * returns the metric type (MetricType.Timer - 4)
     * 
     * @readonly
     * @type {MeasureType}
     * @memberof Timer
     */
    get type():MeasureType {
        return this._type;
    }
    /**
     * returns the current measure name
     * 
     * @readonly
     * @type {string}
     * @memberof Timer
     */
    get name():string {
        return this._name;
    }
    /**
     * returns the current correlationId
     * 
     * @readonly
     * @type {string}
     * @memberof Timer
     */
    get correlationId():string {
        return this._correlationId;
    }
    get sinks():Array<ISink>|ISinkFunction {
        return this._sinks;
    }
    /**
     * returns the current tag collection
     * 
     * @readonly
     * @type {(Tag|Array<Tag>)}
     * @memberof Timer
     */
    get tags():Tag|Array<Tag> {
        if(typeof(this._tags)==='undefined') {
            return [];
        }
        return this._tags;
    }

    /**
     * starts the timer
     * 
     * @memberof Timer
     */
    public start():void {
        if(!this._active) {
            this._active = true;
            let watch = new StopWatch({});
            watch.once('end',this.update);
            this._watch=watch;
            if(this._showCpu) {
                this._startCpuAve = getCpu();
            }
        } else {       
            throw Error('Timer is already running');
        }
    }
    /**
     * stops the timer
     * 
     * @memberof Timer
     */
    public stop():void {
        if(this._watch) {
            this._watch.end();
        }
    }
    /**
     * writes the measure value to the sink
     * 
     * @memberof Timer
     */
    public write():void {
        let writeTags:Array<Tag> = this.addProcessData(this._tags);
        var r:MeasureMessage = {
            name:this._name, 
            type:this._type, 
            value:this._elapsed, 
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
    /**
     * update callback trigger by stopwatch stopping
     * 
     * @private
     * @memberof Timer
     */
    private update = (elapsed:number):void => {
        this._elapsed = elapsed;
        this.write();
        this._active = false;
    }
    
    private setOptions (this: Timer, options:MeasureOptions|undefined):void {
        if(options) {
            this._correlationId = (options.correlationId) ? options.correlationId : '';
            this._tags = (options.tags) ? ((Array.isArray(options.tags)) ? options.tags : new Array<Tag>(<Tag>options.tags)) : new Array<Tag>();
            this._showCpu = (options.cpu) ? options.cpu : false;
            this._showMemory = (options.mem) ? options.mem : false;
        } else {
            this._correlationId = '';
            this._tags = new Array<Tag>();
            this._showCpu = false;
            this._showMemory = false;
        }
    }
    private addProcessData(tags:Array<Tag>):Array<Tag> {
        let ttags:Array<Tag> = tags;
        if(this._showCpu) {
            let cpuUtil = averageCpu(this._startCpuAve, getCpu());
            this.addTag(ttags, 'cpu', cpuUtil);
        }
        if(this._showMemory) {
            let mem:MemoryState = getMemory();
            this.addTag(ttags, 'total_mem',mem.total);
            this.addTag(ttags, 'free_mem', mem.free);
        }
        return ttags;
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