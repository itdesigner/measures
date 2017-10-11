### Logging
Return to the [Main README](../README.md)

This package also includes a custom logging implementation that utilizes the same sink / sink function services as the measures.  The logger in the measures package does its best not to be awkward and get in the way.

##### Log Levels
| Level | Value | Explanation |
|:------|:-----:|:------------|
|VERBOSE|0|Most detailed logging level - designates finer-grained informational events than the DEBUG.|
|DEBUG  |1| Designates fine-grained informational events that are most useful to debug an application.|
|INFO   |2| Designates informational messages that highlight the progress of the application at coarse-grained level.|
|WARN   |3| Designates potentially harmful situations or situations where things are out of band|
|ERROR  |4| Designates error events that might still allow the application to continue running. |
|CRITICAL|5|Designates very severe error events that will presumably lead the application to abort.|

#### Log Level Considerations
Categorize any and all logging events appropriately.  The selected level is part of our
logging framework and will automatically be included. 

See [Logging Considerations](./LOGGINGCONSIDERATIONS.md) for a detailed explanation of which logging levels to use when.

#### Logging Best Practices

See [Logging Best Practices](./LOGBESTPRACTICES.md) for thoughts on logging best practices.

#### The Logger
Like the measures in this package, there a number of ways in which a logger can be created: manually, or via the APM object.

##### Creating a basic Logger
The samples below show the simplest logging constructors; however, additional parameters can be supplied to add tags to be attached to all log entries.
```typescript
  // creating a logger with sinks
  let sinks:Array<ISink> = new Array<ISink>(new ConsoleSink());
  let l:ILogger = new Logger('my application', sinks);


  // creating a logger with a sink function
  let s = (event:string) => { console.log(event); };
  let l:ILogger = new Logger('my application', s);


  // creating a logger from an APM object
  let apm:APM = defaultConsoleAPM();
  let l:ILogger = apm.logger('my application');
```

##### Using the logger
The samples below show the default logging methods with only a simple message; however, the message component can be any object that is serializable.  In addition, additional optional arguments can be supplied to add tags to any log message.  Tags added at the log level are merged with any tags added to the logger at creation.
```typescript
  //CRITICAL log
  log.critical('the sky is falling');
  log.critical('the sky is falling', Error);
  //ERROR log
  log.error('bad things have happened');
  log.error('bad things have happened', Error);

  //WARNING log
  log.warn('queue level too high');

  //INFO log
  log.info('creating a contact');

  //DEBUG log
  log.debug('contact saved to database');

  //VERBOSE log
  log.verbose('contact details....');

  //any log level
  log.log(LogLevel.INFO, 'my message');
```
The output of the logger has the following general format:
>  { timestamp: '2017-10-04T23:49:25.1190-0500',
  level: 4,
  name: 'TestClass.promiseMethod',
  message: 'a bad, bad thing happened',
  tags: [] }

Return to the [Main README](../README.md)