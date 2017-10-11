## Meter
Return to the [Main README](../README.md)

**_Meters are used to gauge the rate at which things occur, thinks events per unit time._**  Meters output not just the current rate information; but, also the average rate since they were started, and a one five and fifteen minute weighted average that is useful in determining trending.

Meters provide the following functions:
* `mark()` - used to mark the occurance of an event.  Called without parameters, it increments by one (1), although it does support any valid number as an argument.
* `write()` - calls the function and writes the current value of the result to the current sink.

##### Creating a basic Meter
Meters require a name (to identify them) and sink(s) to which the results are sent. There is an optional additional parameter related to IOptions for the behavior of the Meter.

```typescript
// create a meter instance manually
let sinks:Array<ISink> = new Array<ISink>(new ConsoleSink());
let meter:IMeasure = new Gauge('meter.name', sinks);


// create a meter from the APM library
let apm = defaultConsoleApm() // default console sink APM
let meter:IMeterMeasure = apm.meterOperation('meter.name',undefined, {uom:'click(s)'});
```
##### Creating a meter that sends to a sink function
```typescript
// custom sink
function mySink(event:IMeasureResult):void {
    console.log(event);
}
let meter:IMeasure = new Meter('meter.name', mySink);
```
##### Using a Meter
```typescript
while(i) {
    // do some work with periodic marking
    meter.mark();
}


//eventually you want to send the values to the sink
meter.write();
```
The default meter console result is a JS object:

> { name: 'meter',
  timestamp: 2017-10-05T00:25:49.265Z,
  type: 'Meter',
  uom: 'click(s)',
  value:
   { count: 10000,
     mean: '602.70',
     oneMinRate: '1692.96',
     fiveMinRate: '1934.43',
     fifteenMinRate: '1977.90' },
  correlationId: '',
  tags: [] }

Return to the [Main README](../README.md)
