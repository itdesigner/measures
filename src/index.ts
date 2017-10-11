import * as Logging from './logging';
import * as Types from './shared';
import * as Measures from './measures';
import * as Sinks from './sinks';
import {APM, defaultAPM, defaultConsoleAPM, defaultDataDogAPM} from './APM';
import {
    log,
    logCritical,
    logError,
    logWarning,
    logInfo,
    logDebug,
    logVerbose,
    logpromise,
    logpromiseCritical,
    logpromiseError,
    logpromiseWarning,
    logpromiseInfo,
    logpromiseDebug,
    logpromiseVerbose,
    timer,
    timerpromise,
    inject,
    injectpromise,
    measure,
    measurepromise
} from './decorators';


export {
    Logging,
    Types,
    Measures,
    Sinks,
    APM,
    defaultAPM,
    defaultConsoleAPM,
    defaultDataDogAPM,
    log,
    logCritical,
    logError,
    logWarning,
    logInfo,
    logDebug,
    logVerbose,
    logpromise,
    logpromiseCritical,
    logpromiseError,
    logpromiseWarning,
    logpromiseInfo,
    logpromiseDebug,
    logpromiseVerbose,
    timer,
    timerpromise,
    inject,
    injectpromise,
    measure,
    measurepromise
}
