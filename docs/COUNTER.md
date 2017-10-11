## Counter
Return to the [Main README](../README.md)


**_The counter provides a non-blocking method to count a value or the number of times that something occurs.  Essentially they are used to ... count things._**


Counters provide the following functions:
* `increment()` - enables the caller to increment the counter by one (1) or an optional alternate value can be provided to increment by any valid number.
* `decrement()` - enables the caller to decrement the counter by one (1) or an optional alternate value can be provided to decrement by any valid number.  The counter can not be decremented below zero (0).
* `reset()` - resets the counter back to zero (0)
* `write()` - writes the current value of the counter to the current sink.

##### Creating a basic Counter
```typescript
// create a counter instance manually
let sinks:Array<ISink> = new Array<ISink>(new ConsoleSink());
let counter:IMeasure = new Counter('counter.name', sinks);


// create a counter from the APM library
let apm = defaultConsoleApm() // default console sink APM
let counter:IMeasure = apm.countOperation('counter.name');
```
##### Creating a counter that send its result to a function
```typescript
// create a counter that sends the results to a function
function mySink(event:IMeasureResult):void {
    console.log(event);
}
let counter:IMeasure = new Counter('counter.name', mySink);
```
##### Using a Counter

```typescript
// use a counter
while(i) {
    ...do some work here
    counter.increment()
}
// eventually you will want to write the value
// although, by default, it will send a count to
// it's sink with every increment or decrement
counter.write();
```
The default counter console result is a JS object:

> {
    name: 'counter.name',
    type: 'Counter',
    value: 300,
    timestamp: 2017-10-04T18:19:43.387Z,
    correlationId: '',
    tags: []
}

Return to the [Main README](../README.md)