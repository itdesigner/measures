## Timer
Return to the [Main README](../README.md)

**_The timer provides a non-blocking method to record the duration of an event or process. _**

Timers provide the following functions:
* `start()` - starts the timer
* `stop()` - stops the timer.  Calling the stop function automatically generates the measure result and forwards it to the current sink.  All times are measures in milliseconds (ms).

###### Creating a basic Timer
Timers require a name (to identify them) and sink(s) to which the results are sent.  There is an optional additional parameter related to `IOptions` for the behavior of the timer.
```typescript
// create a timer instance manually
let sinks:Array<ISink> = new Array<ISink>(new ConsoleSink());
let timer:ITimerMeasure = new Timer('timer.name', sinks);


// create a timer from the APM library
let apm = defaultConsoleApm(); // default console sink APM
let timer:ITimerMeasure = apm.timeOperation('timer.name');
```
###### Creating a Timer that sends its results to a function
In addition to providing an Array of `ISink` objects to the Timer, you have the option to pass it a sink function instead.  This is any function that accepts **any** and returns **void**.
```typescript
// create a timer that sends the results to a function

function mySink(event:IMeasureResult):void {
    console.log(event);
}

let timer:ITimerMeasure = new Timer('timer.name', mySink);
```
###### Using a Timer
```typescript
// start a timer
timer.start();
... something you want to measure
// stop the measure and it will automatically write to its sink(s)
timer.stop();

// timers can be reused once they have been stopped
timer.start();
...
```
The default timer console result is a JS object:

> { name: 'timer.name',
  type: 'Timer',
  value: 5006.534593999386,
  timestamp: 2017-10-04T18:19:43.387Z,
  correlationId: '',
  tags: [] }

Return to the [Main README](../README.md)
