## Logging Best Practices
Return to the [Main README](./LOGGER.md)

Return to the [Main README](../README.md)

The following are some basic best practices for consideration:
* Use clear key-value pairs – One of the most powerful features of proper logging is the
ability to extract fields and create structured data that can be filtered and pivoted against.
Use the template strategy whenever possible.
* Create entries that humans can read – Avoid using complex encoding or layouts that
make even information unintelligible. Specifically, Developers like the ability to receive a
stream of data over HTTP/S when possible, and with data structured so that it can be
easily processed. Developer-friendly formats like JavaScript Object Notation (JSON) are
readable by humans and machines.
* Be concise and descriptive - Each logging statement should contain both data and
description. Consider the following examples (which generates the more useful output?):

```typescript
log.debug('Message processed';);
log.debug(message.getMessageID());
  
log.debug('Message with id %{1} processed', message.id);
```
* Use timestamps for every event – The correct time is critical to understanding the
proper sequence of events. Out framework will automatically timestamp logging events.
* Use unique identifiers - Unique identifiers such as transaction IDs and user IDs are
tremendously helpful when debugging, and even more helpful when you are gathering
analytics. Unique IDs can point you to the exact transaction. Without them, you might
only have a time range to use. When possible, carry these IDs through multiple touch
points and avoid changing the format of these IDs between modules. That way, you can
track transactions through the system and follow them across machines, networks, and
services.
* Log more than just debugging events - Put semantic meaning in events to get more
out of the data. Log audit trails, what users are doing, transactions, timing information,
and so on. Log anything that can add value when aggregated, charted, or further
analyzed. In other words, log anything that is interesting to the business.
* Use log levels properly – Categorize any logging events. For example, use severity
values like DEBUG, INFO, WARN, ERROR, and FATAL. This is part of our logging
framework and will automatically be included.
* Identify the source (and destination) – include the source and, if appropriate, the
target of the log event. This information should include system, sub-system, application
domain, type, and any context information available such as workspace ID, etc. The
goal here is to provide useful context in which a logging event occurred:

    * what went wrong
    * how badly it went wrong
    * in case we recover, shortly describe how (especially on WARN level)
    * provide possible context / description for possible causes of the error.
* Collect events from everything, everywhere - Collect all the data you can, because
the more data you capture, the more visibility you have. For example, collect these when
you can:
  * Application logs
  * Database logs
  * Network logs
  * Configuration files
  * Performance data (iostat, vmstat, ps, etc.)
  * Anything that has a time component
* Avoid string concatenation – string concatenation is expensive and resource
consuming, use substitution parameters instead.
* Log method arguments and return values - When you find a bug during development,
you typically run a debugger trying to track down the potential cause. Now imagine for a
while that you can’t use a debugger. For example, because the bug manifested itself on
a customer environment few days ago and everything you have is logs. Would you be
able to find anything in them? If you follow the simple rule of logging each method input
and output (arguments and return values), you don’t even need a debugger any more.
Of course, you must be reasonable but every method that: accesses external system
(including database), blocks, waits, etc. should be considered. You should consider
DEBUG or TRACE levels as best suited for these types of logs.
* Watch out for external systems – a special case of the previous best practice. If you
communicate with an external system, consider logging every piece of data that comes
out from your application and gets in. Period.
* Log exceptions properly - Logging exceptions is one of the most important roles of
logging at all. At a minimum, every Try/Catch should include a logging statement. Don’t
swallow exceptions unless you are 100% certain that you don’t need to handle them
(this is rare).
* When possible use framework tools for writing logs - This will reduce the amount of
boilerplate code you have to write. For example, instead of manually logging an API call
in every API controller you write, write a middleware that allows you to log every API call
automatically.
* Do NOT log sensitive information - This includes obvious things such as passwords,
but it also includes business information that the operator doesn’t need to know.
* Additional considerations:
  * You want to have exception/problem information available for first-pass problem
determination in a production level enterprise application without turning on
debug as a default log level. There is simply too much information in debug to be
appropriate for day-to- day operations.
  * Pre-optimization of logging performance is typically wasteful – don’t completely
ignore performance while logging, but, in general, logging performance is good
and will not substantially affect your code.

Return to the [Main README](./LOGGER.md)

Return to the [Main README](../README.md)