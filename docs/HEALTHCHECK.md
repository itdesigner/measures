## HealthCheck
Return to the [Main README](../README.md)

**_HealthChecks measure the health of something over time (true/false)._** Suppose a developer wanted to track the availability of a resource, we can periodically sample that value as the metric `resource-available`.  Each individual healthcheck measures the value as it exists at the moment it is called.

HealthChecks provide the following functions:
* `write()` - calls the function and writes the current value of the result to the current sink.

##### Creating a basic HealthCheck
Healthchecks require a name (to identify them) and sink(s) to which the results are sent. Healthchecks **require** a parameterless function that specifed that is to be called to retrieve the healthcheck value (boolean). There is an optional additional parameter related to IOptions for the behavior of the HealthCheck.
```typescript
// some measuring function ():boolean
let m = ()=>{
    ...measure something here
    return false;   //lets pretend this is the result
}

// create a healthcheck instance manually
let sinks:Array<ISink> = new Array<ISink>(new ConsoleSink());
let healthcheck:IMeasure = new Gauge('healthcheck.name', sinks, m);


// create a healthcheck from the APM library
let apm = defaultConsoleApm() // default console sink APM
let healthcheck:IMeasure = apm.healthOperation('healthcheck.name', m);
```
##### Creating a HealthCheck with a custom sink function
```typescript
// create a healthcheck that sends the results to a function
function mySink(event:IMeasureResult):void {
    console.log(event);
}
let healthcheck:IMeasure = new Gauge('healthcheck.name', mySink, m);
```
##### Using a Healthcheck
```typescript
while(i) {
    // do some work with periodic measure
    healthcheck.write()
}

```
The default healthcheck console result is a JS object:

> {
    name: 'healthcheck.name',
    type: 'HealthCheck',
    value: true,
    timestamp: 2017-10-04T18:19:43.387Z,
    correlationId: '',
    tags: []
}

Return to the [Main README](../README.md)