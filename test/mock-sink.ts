import {LogLevel} from '../src/shared';

export class MockSink {
    public _sinkData: any[];
    public messageCount: number;
    public logLevel: LogLevel;

    get sinkData() {
        return this._sinkData;
    }
    constructor() {
        this.messageCount = 0;
        this._sinkData = new Array();
        this.logLevel = LogLevel.VERBOSE;
    }
    public send(result: any) {
        this.messageCount++;
        this._sinkData.push(result);
    }
}
