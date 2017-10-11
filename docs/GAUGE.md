## Gauge
Return to the [Main README](../README.md)

**_Gauges measure the value of a particular thing over time._** Suppose a developer wanted to track the the depth of a queue, we can periodically sample that value as the metric `queue-depth`.  Each individual gauge measures the value as it exists at the moment it is called.


Gauges provide the following functions:
* `write()` - calls the function and writes the current value of the result to the current sink.

##### Creating a Gauge
Gauges require a name (to identify them) and sink(s) to which the results are sent. Gauges also **require** a parameterless function that will be called to retrieve the gauge value. There is an optional additional parameter related to IOptions for the behavior of the Gauge.
```typescript
// some measuring function ():number
let m = ()=>{
    ...measure something here
    return 80;   //lets pretend this is the result
}


// create a gauge instance manually
let sinks:Array<ISink> = new Array<ISink>(new ConsoleSink());
let gauge:IMeasure = new Gauge('gauge.name', sinks, m);


// create a gauge from the APM library
let apm = defaultConsoleApm() // default console sink APM
let gauge:IMeasure = apm.gaugeOperation('gauge.name', m);
```
##### Creating a Gauge with a custom sink function
```typescript
// create a gauge that sends the results to a function
function mySink(event:IMeasureResult):void {
    console.log(event);
}

let gauge:IMeasure = new Gauge('gauge.name', mySink, m);
```

##### Using a Gauge
```typescript
while(i) {
    // do some work with periodic measure
    gauge.write();  //NOTE: calls the function and writes the result to the sink
}

```
The default gague console result is a JS object:

> {
    name: 'gauge.name',
    type: 'Gauge',
    value: 300,
    timestamp: 2017-10-04T18:19:43.387Z,
    correlationId: '',
    tags: []
}

Return to the [Main README](../README.md)