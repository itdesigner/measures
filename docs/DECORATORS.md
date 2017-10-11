## Decorators
Return to the [Main README](../README.md)

There are 5 decorators that are included within the measures package.  Two each to support declarative logging, timers, and a generic wrap decorator for injecting your own functionality into methods.

Each pair of decorators supports two distinct types of js/typescript methods - synchronous and promise-based.

### Timer decorators
* **@timer()** => Will log how long the method takes using the input string as a key. If the key is not provided, the default key is [className].[methodName]
* **@promisetimer()** => Will log how long the promise returned by the method takes to resolve using the input string as a key.

Both decorators can take an optional second parameter to specify additional options when using the timer (IOptions with an ILogOptions child to address logging functionality).  The final (optional) parameter allows the developer to specify a collection of sinks, a sink function, or an APM instance to use for sinks; if no sink is specified, a default APM instance will be used.

##### Using the timer decorators
```typescript
    class Test {

        @promisetimer("test1")
        public longPromiseMethod(): Promise<string> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
        }

        @timer("test2")
        public longSyncronousMethod() {
            for (let i = 0; i < 100000000; i++) {

            }
        }
        // a much more involved timer behavior
        let resultProcessor = (r:any):any => {
            if(typeof(r) === 'string') {
                return r.toUpperCase();
            }
            return r;
        }
        let o:IOptions = {
            mem : true,
            cpu : true,
            log : {
              args : true,
              loglevel : LogLevel.DEBUG,
              results : resultProcessor
            }
        };
        @timer("test3", o)
        public longSyncronousMethod() {
            for (let i = 0; i < 100000000; i++) {

            }
        }
    }
```
The logged result for a timer takes the following format:
>{ name: 'TestClass.testMethod1',
  type: 'Timer',
  value: 0.07070699999894714,
  timestamp: 2017-10-05T04:49:25.139Z,
  correlationId: '',
  tags: [],
  method: undefined }

If logging options were enabled (default behavior), it will also generate a second log with the method details:
>{ timestamp: '2017-10-04T23:49:25.1190-0500',
  level: 3,
  name: 'TestClass.testMethod1',
  args: [ '"bob"' ],
  results: '"bob likes clown"',
  tags: [] }

### Log decorators
* **@log()** => Will log method arguments and results using the input string as a key. If the key is not provided, the default key is [className].[methodName]
* **@promiselog()** => Will log method arguments and results once the promise is resolved using the input string as a key.

Both decorators can take an optional second parameter to specify additional options when using the log (ILogOptions controls logging functionality).  The final (optional) parameter allows the developer to specify a collection of sinks, a sink function, or an APM instance to use for sinks; if no sink is specified, a default APM instance will be used.

##### Using the log decorators
```typescript
    class Test {

        @promiselog("test1")
        public longPromiseMethod(): Promise<string> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
        }

        @log("test2")
        public longSyncronousMethod() {
            for (let i = 0; i < 100000000; i++) {

            }
        }
        // a much more involved timer behavior
        let resultProcessor = (r:any):any => {
            if(typeof(r) === 'string') {
                return r.toUpperCase();
            }
            return r;
        }
        let o:ILogOptions = {
            args : true,
            loglevel : LogLevel.DEBUG,
            results : resultProcessor
        };
        @log("test3", o)
        public longSyncronousMethod() {
            for (let i = 0; i < 100000000; i++) {

            }
        }
    }
```
The logged result takes the following format:
>{ timestamp: '2017-10-04T23:49:25.1190-0500',
  level: 3,
  name: 'TestClass.testMethod1',
  args: [ '"bob"' ],
  results: '"bob likes clown"',
  tags: [] }

### Wrap decorator
* **@wrap()** => decorator for wrapping classes or class methods with you own custom code. You can also edit the parameters!

With it you can easily make:
  * logger functions
  * edit the input parameters to a method
  * edit the output from a method
  * do something extra with the result (ie write to file)
  * skip calling the method
  * do what you want...

To use the wrap decorator, use must make a function that has 4 parameters:
| Parameters|description|
|*----------|*----------|
|callback   |The actual method/class. REMEMBER TO INVOKE THIS METHOD AND RETURN THE VALUE|
|args       |The arguments passed to the original method/class|
|name       | The method name of the method/class that is invoked|
|type       |The object type where the decorator is placed (class or function)|

##### Using the wrap decorator
```typescript
var marker = (callback, args, name, type) => {
  console.log('Entering  ', type, name);
  var result = callback();
  console.log('Leaving: ', name);
  return result;
};

@wrap(marker)
class SuperClass {
    constructor(){
        //some business here....
        console.log('hello from class');
        //some business here....
    }
    @wrap(marker)
    bar(a,b) {
        //some business here....
        console.log('hello from bar method');
        //some business here....
    }
}

new SuperClass().bar(1,2);
```


### LogOptions for @timer and @log decorators
Both the logging and the timer decorators support additional logging options to control their behavior.

| Option        | Type           | Default | Explanation  |
|:------------- |:-------------|:----|:-----|
| *args*| boolean or a function | true (show) | determines whether to show or hide the arguments (boolean) or a function that can be called to enable the user to receive a copy of the arguments and transform it prior to logging.  _**NOTE:** this does not modify the arguments used by the method_ |
| *tags*      | Tag or [Tag]      | none | a collection of tags that should be appended to any result written to logs |
| *results* | boolean or function      |    true (show) | determines whether to show or hide the results (boolean) or a function that can be called to enable the user to receive a copy of the result and transform it prior to logging.  _**NOTE:** this does not modify the returned value from the method_ |
| *loglevel* | LogLevel      |    INFO | The log level to use when recording the method |

### Performance notes
Expect the decorators to add ~0.3ms to every call to the function.  To test this in your use case, just add the decorator to a method twice with different tags.  The difference between the two averages is roughly how long the decorator is taking.

Return to the [Main README](../README.md)