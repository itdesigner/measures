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

### Inject decorator
* **@inject()** => decorator that allows for wrapping methods with your own custom pre and post post functions.  This decorator allows you to modify arguments prior to execution, perform validation, and even perform audit operations automatically.

With it you can easily make:
  * logger functions
  * edit the input parameters to a method
  * edit the output from a method
  * do something extra with the result (ie write to file)
  * skip calling the method
  * perform validation prior to executing a function
  * creating an audit of calls
  * do what you want...


To use the inject decorator, you must create a custom pre or post inject function, or both if you want.  The function definitions are similar and look like the folowing:

**IPreInjectFunction**   (name: string, ...args: any[]) => any[];
**IPostInjectFunction**  (name: string, args: any) => any;


| function type        | parameter          | Description | 
|:------------- |:-------------|:----|
| *pre-inject*| name | this parameter is used to identify the source of the call (*default is the class.method name*)|
| *pre-inject*| ...args| the original arguments that the function was given |
|*pre-inject* | results | the new argument results that will actually be provided to the function. **NOTE:** the pre-inject must pass back parameters to be used by the function, even if it does nothing with them. |
| *post-inject* | name | this parameter is used to identify the source of the call (*default is the class.method name*)|
| *post-inject* | args | this represents the returned result from the actual function call |
| *post-inject* | result | the results that will actually be returned from the function. **NOTE:** the post-inject must pass back results (modified or not), even if it does nothing with them. |


##### Using the inject decorator
```typescript
// this is the pre-inject function
const pre: IPreInjectFunction = (name: string, ...args: any[]): any[] => {
    const results: any[] = new Array();
    // we are going to double the parameters before returning them - although this could be validation, or whatever
    for (const arg of args) {
        results.push(arg * 2);
    }
    return results;
};
// this is the post-inject function
const post: IPostInjectFunction = (name: string, args: any): any => {
    // lets upperCase any answers - although it could do anything
    const results: any = JSON.stringify(args).toUpperCase();
    return results;
};

class SuperClass {
    constructor(){
        //some business here....
    }

    // NOTE: it is not necessary to have both a pre- and post-inject function, you can also use only one or the other
    @inject(pre, post)
    bar(a,b) {
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