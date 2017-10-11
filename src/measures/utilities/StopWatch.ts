import events =require('events');
const EventEmitter = events.EventEmitter;

/**
 * StopWatch implementation
 * 
 * @export
 * @class StopWatch
 * @extends {EventEmitter}
 */
export class StopWatch extends events.EventEmitter{
    private _start:any;
    private _ended:boolean;
    private _getTime:number;

    /**
     * Creates an instance of StopWatch.
     * 
     * stopwatch automatically started on instantiation
     * @param {*} options 
     * @memberof StopWatch
     */
    constructor(options:any) {
        super();
        options = options || {};
        EventEmitter.call(this);
        if(options.getTime) { 
          this._getTime = options.getTime;
        }
        this._start = this.getTime();
        this._ended = false;
    }
    /**
     * stops this stopwatch
     * 
     * @returns {(number|undefined)} 
     * @memberof StopWatch
     */
    end():number|undefined {
        if(this._ended) {
            return;
        }
        this._ended=true;
        let elap = this.getTime() - this._start;
        this.emit('end', elap);
        return elap;
    }
    /**
     * gets the current elapsed time
     * 
     * @returns {number} 
     * @memberof StopWatch
     */
    getTime():number {
        if(!process.hrtime) {
            return Date.now();
        }
        let hrtime:[number, number] = process.hrtime();
        return hrtime[0] * 1000 + hrtime[1]/(1000*1000);
    } 
}