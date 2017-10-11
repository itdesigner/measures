## Log Level Considerations
Return to the [Logger README](./LOGGER.md)

Return to the [Main README](../README.md)

Categorize any and all logging events appropriately.  The selected level is part of our
logging framework and will automatically be included.  The available logging levels from highest to
lowest are:

CRITICAL – severe errors that cause premature termination and critical errors causing complete failure of
the application. Expect these to be immediately visible on any status console.

  >_**Considerations:**  This is an overall application or system failure that should be investigated
  immediately. Yes, wake up the Admin. Since we prefer our Admins alert and well-rested,
  this severity should be used very infrequently. If it's happening daily and that's not a very
  big deal, it's lost its meaning. Typically, a Fatal error only occurs once in the process
  lifetime, so if the log is tied to the process, this is typically the last message in the log._

ERROR – something terribly wrong had happened, that must be investigated immediately. Indicates a
failure within the application or connected system.  No system can tolerate items logged on this level.
Example: NPE, database unavailable, mission critical use case cannot be continued.  Expect these to be
immediately visible on any status console.

>_**Considerations:** This is definitely a problem that should be investigated. Admin should be
notified automatically, but doesn't need to be dragged out of bed. By filtering a log to look
at errors and above you get an overview of error frequency and can quickly identify the
initiating failure that might have resulted in a cascade of additional errors. Tracking error
rates as versus application usage can yield useful quality metrics such as MTBF (Mean
time Between Failures) which can be used to assess overall quality. For example, this
metric might help inform decisions about whether or not another beta testing cycle is
needed before a release._

WARNING – the process might be continued, but take extra caution, typically used as indicators of
possible issues or service/functionality degradation.   This level of logging comprises two distinct types of
information: one for obvious problems where work-around exists (for example: “Current data unavailable,
using cached values”) and second for potential problems and suggestions. The application can tolerate warning messages, but they should always be justified and examined.  Examples might include: use of deprecated APIs, poor use of API, 'almost' errors, other run-time situations that are undesirable or
unexpected, but not necessarily 'wrong', “Application running in development mode” or “Administration
console is not secured with a password”.  Expect these to be immediately visible on any status console.
>_**Considerations:** This MIGHT be problem, or might not. For example, expected transient
environmental conditions such as short loss of network or database connectivity should be
logged as Warnings, not Errors. Viewing a log filtered to show only warnings and errors
may give quick insight into early hints at the root cause of a subsequent error. Warnings
should be used sparingly so that they don't become meaningless. For example, loss of
network access should be a warning or even an error in a server application, but might be
just an Info in a desktop app designed for occasionally disconnected laptop users._

INFO – events of interest or that have relevance to outside observers; the default enabled minimum
logging level.  Examples include: important business process has started or finished. In an ideal world, an
administrator or advanced user should be able to understand INFO messages and quickly find out what
the application is doing. Other definition of INFO message: each action that changes the state of the
application significantly (database update, external system request).  Expect that it is likely for these to be
visible on any status console.

>_**Considerations:** This is important information that should be logged under normal
conditions such as successful initialization, services starting and stopping or successful
completion of significant transactions. Viewing a log showing Info and above should give a
quick overview of major state changes in the process providing top-level context for
understanding any warnings or errors that also occur. Don't have too many Info
messages. We typically have < 5% Info messages relative to Verbose._

DEBUG – internal control flow and diagnostic state dumps to facilitate pinpointing of recognized
problems.

>_**Considerations:**  This level and verbose are used almost exclusively by developers to
troubleshoot specific problems.  The information here exists at a detailed level about
logical operations that are occurring within the code that can be used by the developer to
determine the flow of a process through the system._  

VERBOSE - tracing information and debugging minutiae; generally only switched on in unusual
situations.  Examples include performance level logging and loop counters.

>_**Considerations:**  This is the the most detailed level of logging and will only be used by
developers with a deep understanding of the code to troubleshoot intricate problems.  This
is typically the most commonly used severity level for things like performance metrics and
logging specific details about internal state of functions in the environment._

When choosing an appropriate log level for a particular logging entry it is best to consider how the
information will be used by the consumer of a log.  Administrative users will typically only see logging levels at INFO and higher. The higher the level , the more importance that it should take in their mind
and be more specific and actionable with the messages as the level increases.  While developers
will be able to see all logging levels, the information found in the DEBUG and certainly the
VERBOSE log levels is mostly of use to them and should be targeted appropriately.

Return to the [Logger README](./LOGGER.md)

Return to the [Main README](../README.md)