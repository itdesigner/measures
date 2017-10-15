import {ILogOptions} from './LogOptions';
import {Tag} from './types';

/**
 * options for all measure constructors
 *
 * @export
 * @type MeasureOptions
 */
export interface IMeasureOptions {
    /**
     * correlation id (optional)
     *
     * supported by all measures
     *
     * @type {string}
     * @memberof MeasureOptions
     */
    correlationId?: string;
    /**
     * tags (optional)
     *
     * supported by all measures
     *
     * @type {(Tag|Array<Tag>)}
     * @memberof MeasureOptions
     */
    tags?: Tag | Tag[];
    /**
     * average cpu utilization; true, to show; false, otherwise
     *
     * defaults to false if not specified
     *
     * supported by all measures
     *
     * @type {boolean}
     * @memberof MeasureOptions
     */
    cpu?: boolean;
    /**
     * current memory utilization; true, to show; false, otherwise
     *
     * defaults to false if not specified
     * supported by counter, timer
     *
     * @type {boolean}
     * @memberof MeasureOptions
     */
    mem?: boolean;
    /**
     * unit of measure (optional)
     *
     * supported by all measures
     *
     * @type {string}
     * @memberof MeasureOptions
     */
    uom?: string;
    /**
     * measures immediately written to sinks: true if immediate write, false otherwise
     *
     * defaults to true
     *
     * supported by counter
     *
     * @type {boolean}
     * @memberof MeasureOptions
     */
    directWrite?: boolean;
    /**
     * a resolution of how often writes are done to the sink
     *
     * default to 1 (write for every measure)
     *
     * supported by counter
     *
     * @type {number}
     * @memberof MeasureOptions
     */
    resolution?: number;
    /**
     * used only by decorators to enable argument logging
     *
     * @type {boolean}
     * @memberof MeasureOptions
     */
    log?: ILogOptions;
}
