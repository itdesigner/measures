
/**
 * Exponentially weighted moving average
 * 
 * @export
 * @class EWMAT
 */
export class EWMA {
    
    static M1_ALPHA:number = 1 - Math.exp(-5/60);
    static M5_ALPHA:number = 1 - Math.exp(-5/60/5);
    static M15_ALPHA:number = 1 - Math.exp(-5/60/15);

    private _uncounted:number;
    private _interval:number;
    private _initialized:boolean;
    private _currentRate:number;
    private _alpha:number;
    private _tickInterval:any;

    /**
     * Creates an instance of EWMAT.
     * @param {number} alpha 
     * @param {number} interval : time in milliseconds
     * @memberof EWMAT
     */
    constructor(alpha:number, interval:number) {
        let _self = this;
        this._alpha = alpha;
        this._interval = interval;
        this._initialized = false;
        this._currentRate = 0;
        this._uncounted = 0;
        if(interval) {
            this._tickInterval = setInterval(function() { _self.tick();}, interval);
            if(this._tickInterval.unref) {
                this._tickInterval.unref();
            }
        }
    }
    /**
     * updates counts
     * 
     * @param {number} n 
     * @memberof EWMAT
     */
    update(n:number):void {
        this._uncounted +=(n || 1);
    }
    /**
     * update the rate measurement very interval
     * 
     * @memberof EWMAT
     */
    tick():void {
        let instantrate = this._uncounted / this._interval;
        this._uncounted = 0;
        if(this._initialized) {
            this._currentRate += this._alpha * (instantrate - this._currentRate);
            //console.log("Current Rate: " + this._currentRate);
        } else {
            this._currentRate = instantrate;
            this._initialized=true;
        }
    }
    /**
     * stop collecting rates
     * 
     * @memberof EWMAT
     */
    stop() {
        clearInterval(this._tickInterval);
    }

    /**
     * returns the current rate
     * 
     * @readonly
     * @type {number}
     * @memberof EWMAT
     */
    get rate():number {
        return this._currentRate * 1000;
    }
    static get oneMinuteEWMA():EWMA {
        return new EWMA(this.M1_ALPHA, 5000);
    }
    static get fiveMinuteEWMA():EWMA {
        return new EWMA(this.M5_ALPHA, 5000);
    }
    static get fifteenMinuteEWMA():EWMA {
        return new EWMA(this.M15_ALPHA, 5000);
    }
}
