import * as moment from 'moment';
import {ILogMessage, LogLevel, Tag} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {ILogger} from './ILogger';

function isISink(object: any): object is ISink {
    return 'logLevel' in object;
}

/**
 * Logger implementation
 *
 * @export
 * @class Logger
 */
export class Logger implements ILogger {
    private _sinks: ISink[] | ISink | ISinkFunction;
    private _context: string;
    private _tags?: Tag[] | Tag;

    /**
     * constructor for logger
     *
     * @param {string} [context]
     * @param {(Array<ISink>|ISink|ISinkFunction)} [provider]
     * @param {(Array<Tag>|Tag)} [tags]
     * @memberof Logger
     */
    constructor(context: string, provider: ISink[] | ISink | ISinkFunction, tags?: Tag[] | Tag) {
        this._sinks = provider;
        this._context = context;
        this._tags = tags;
    }

    /**
     * return default tags
     *
     * @type {(Array<Tag>|Tag|undefined)}
     * @memberof Logger
     */
    get tags(): Tag[] | Tag | undefined {
        return this._tags;
    }
    /**
     * set default tags
     *
     * @memberof Logger
     */
    set tags(val: Tag[] | Tag | undefined) {
        this._tags = val;
    }
    get sinks(): ISink[] | ISink | ISinkFunction {
        return this._sinks;
    }
    /**
     * get default context
     *
     * @type {(string|undefined)}
     * @memberof Logger
     */
    get context(): string {
        return this._context;
    }
    /**
     * set default context
     *
     * @memberof Logger
     */
    set context(val: string) {
        this._context = val;
    }

    /**
     * anything logger
     *
     * @param {LogLevel} level
     * @param {*} message
     * @param {(Array<Tag>|Tag)} [tags]
     * @memberof Logger
     */
    public log(level: LogLevel, message: any, tags?: Tag[] | Tag): void {
        const m: ILogMessage = this.createLogMessage(message, level, this._context, undefined, tags);
        this.send(m);
    }
    /**
     * verbose logger
     *
     * @param {*} message
     * @param {(Array<Tag>|Tag)} [tags]
     * @memberof Logger
     */
    public verbose(message: any, tags?: Tag[] | Tag) {
        const m: ILogMessage = this.createLogMessage(message, LogLevel.VERBOSE, this._context, undefined, tags);
        this.send(m);
    }
    /**
     * debug logger
     *
     * @param {*} message
     * @param {(Array<Tag>|Tag)} [tags]
     * @memberof Logger
     */
    public debug(message: any, tags?: Tag[] | Tag) {
        const m: ILogMessage = this.createLogMessage(message, LogLevel.DEBUG, this._context, undefined, tags);
        this.send(m);
    }
    /**
     * info logger
     *
     * @param {*} message
     * @param {(Array<Tag>|Tag)} [tags]
     * @memberof Logger
     */
    public info(message: any, tags?: Tag[] | Tag) {
        const m: ILogMessage = this.createLogMessage(message, LogLevel.INFO, this._context, undefined, tags);
        this.send(m);
    }
    /**
     * warning logger
     *
     * @param {*} message
     * @param {(Array<Tag>|Tag)} [tags]
     * @memberof Logger
     */
    public warn(message: any, tags?: Tag[] | Tag) {
        const m: ILogMessage = this.createLogMessage(message, LogLevel.WARNING, this._context, undefined, tags);
        this.send(m);
    }
    /**
     * error logger
     *
     * @param {*} message
     * @param {*} [ex]
     * @param {(Array<Tag>|Tag)} [tags]
     * @memberof Logger
     */
    public error(message: any, ex?: any, tags?: Tag[] | Tag) {
        const m: ILogMessage = this.createLogMessage(message, LogLevel.ERROR, this._context, ex, tags);
        this.send(m);
    }
    /**
     * critical error logger
     *
     * @param {*} message
     * @param {*} [ex]
     * @param {(Array<Tag>|Tag)} [tags]
     * @memberof Logger
     */
    public critical(message: any, ex?: any, tags?: Tag[] | Tag) {
        const m: ILogMessage = this.createLogMessage(message, LogLevel.CRITICAL, this._context, ex, tags);
        this.send(m);
    }

    private send(message: ILogMessage): void {
        if (this._sinks) {
            if (Array.isArray(this._sinks)) {
                for (const s of this._sinks) {
                    s.send(message);
                }
            } else if (isISink(this._sinks)) {
                this._sinks.send(message);
            } else if (typeof(this._sinks) === 'function') {
                this._sinks(message);
            }
        }
    }
    private createLogMessage(message: any, level: LogLevel, context: string | undefined, error?: any, tags?: Tag[] | Tag | undefined): ILogMessage {
        const logTags: Tag[] | Tag | undefined = this.mergeTags(this._tags, tags);
        const m: ILogMessage = {
            timestamp: moment().toDate(),
            level,
            name: (context) ? context  : '',
            message: JSON.stringify(message),
            tags: logTags,
        };
        if (typeof(error) !== 'undefined') {
            m.error = JSON.stringify(error);
        }
        return m;
    }
    private mergeTags(rootTags: Tag[] | Tag | undefined, tagSet: Tag[] | Tag | undefined): Tag[] | Tag | undefined {
        let result: Tag[] | Tag | undefined = tagSet;
        if (rootTags && Array.isArray(rootTags)) {
            result = (tagSet && (Array.isArray(tagSet) || typeof(tagSet) !== 'undefined')) ? rootTags.concat(tagSet) : rootTags;
        } else if (rootTags && typeof(rootTags) !== 'undefined') {
            if (tagSet && Array.isArray(tagSet)) {
                result = tagSet.concat(rootTags);
            } else if (tagSet && typeof(tagSet) !== 'undefined') {
                result = new Array<Tag>(rootTags, tagSet);
            }
        } else {
            result = tagSet;
        }
        return result;
    }
}
