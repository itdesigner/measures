
/**
 * Measure Type
 *
 * @export
 * @enum {number}
 */
export enum MeasureType {
    /**
     * Unknown measure type
     */
    Unknown,
    /**
     * A Counter based measure
     */
    Counter,
    /**
     * A Gauge based measure
     */
    Gauge,
    /**
     * A Meter based measure
     */
    Meter,
    /**
     * A Timer based measure
     */
    Timer,
    /**
     * A HealthCheck measure
     */
    Health,
    /**
     * A Histogram-based timer measure
     */
    HistogramTimer,
}
/**
 * Logging Level
 *
 * @export
 * @enum {number}
 */
export enum LogLevel {
    /**
     * Verbose (most detailed level of logging)
     */
    VERBOSE,
    /**
     * Debug (used for lower level logging)
     */
    DEBUG,
    /**
     * Information (used for general logging)
     */
    INFO,
    /**
     * Warning (used to indicate an unusal although handled condition)
     */
    WARNING,
    /**
     * Error (used to indicate an unhandled exception)
     */
    ERROR,
    /**
     * Critical error (application or process major failure)
     */
    CRITICAL,
}

/**
 * a tag that can be represented by a key value pair
 *
 * @export
 * @interface IKeyValueTag
 */
export interface IKeyValueTag {
    [index: string]: string | number | boolean;
}

export type Tag = string | IKeyValueTag;
