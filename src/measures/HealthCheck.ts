import * as moment from 'moment';
import {IMeasureMessage, IMeasureOptions, MeasureType, Tag} from '../shared';
import {ISink, ISinkFunction} from '../sinks';
import {IMeasure} from './IMeasures';
import {IOperationFunction} from './IOperationFunction';

/**
 * Gauge measure implementation
 *
 * @export
 * @class Gauge
 * @implements {IMeasure}
 */
export class HealthCheck implements IMeasure {
    private _type: MeasureType;
    private _name: string;
    private _correlationId: string;
    private _uom: string;
    private _sinks: ISink[] | ISinkFunction;
    private _tags: Tag[];
    private _operation: IOperationFunction;

    /**
     * Creates an instance of HealthCheck.
     * @param {string} name
     * @param {Array<ISink>|ISinkFunction} sinks
     * @param {IHealthCheckFunction} operation
     * @param {IOptions} [options]
     * @memberof HealthCheck
     */
    constructor(name: string, sinks: ISink[] | ISinkFunction, operation: IOperationFunction, options?: IMeasureOptions) {
        if (typeof(name) === 'undefined') {
            throw Error('Invalid arguments: name is required');
        }
        if (typeof(sinks) === 'undefined') {
            throw Error('Invalid arguments: sinks are required');
        }
        if (typeof(operation) !== 'function') {
            throw new Error('invalid healthcheck function');
        }
        this._name = name;
        this._type = MeasureType.Health;
        this._sinks = sinks;
        this._tags = new Array<Tag>();
        this._operation = operation;
        this.setOptions(options);
    }

    /**
     * returns the metric type (MetricType.HealthCheck - 4)
     *
     * @readonly
     * @type {MeasureType}
     * @memberof HealthCheck
     */
    get type(): MeasureType {
        return this._type;
    }
    /**
     * returns the current measure name
     *
     * @readonly
     * @type {string}
     * @memberof HealthCheck
     */
    get name(): string {
        return this._name;
    }
    /**
     * returns the current correlationId
     *
     * @readonly
     * @type {string}
     * @memberof HealthCheck
     */
    get correlationId(): string {
        return this._correlationId;
    }
    /**
     * unit of measure
     *
     * @readonly
     * @type {string}
     * @memberof HealthCheck
     */
    get uom(): string {
        return this._uom;
    }
    get sinks(): ISink[] | ISinkFunction {
        return this._sinks;
    }
    /**
     * returns the current tag collection
     *
     * @readonly
     * @type {(Tag|Array<Tag>)}
     * @memberof HealthCheck
     */
    get tags(): Tag | Tag[] {
        return this._tags;
    }

    /**
     * writes the measure value to the sink
     *
     * @memberof HealthCheck
     */
    public write(): void {
        const writeTags: Tag[] = this._tags;
        const value = this._operation();
        const r: IMeasureMessage = {
            name: this._name,
            type: this._type,
            uom: this._uom,
            value,
            timestamp: moment().toDate(),
            correlationId: this._correlationId,
            tags: writeTags,
        };
        if (typeof(this._sinks) === 'function') {
            this._sinks(r);
        } else {
            for (const s of this._sinks) {
                s.send(r);
            }
        }
    }

    private setOptions(options: IMeasureOptions | undefined): void {
        if (options) {
            this._correlationId = (options.correlationId) ? options.correlationId : '';
            this._tags = (options.tags) ? ((Array.isArray(options.tags)) ? options.tags : new Array<Tag>(options.tags as Tag)) : new Array<Tag>();
            this._uom = (options.uom) ? options.uom : 'operation(s)';
        } else {
            this._correlationId = '';
            this._tags = new Array<Tag>();
            this._uom = 'operation(s)';
        }
    }
}
