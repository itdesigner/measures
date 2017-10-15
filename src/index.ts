import {APM, defaultAPM, defaultConsoleAPM, defaultDataDogAPM} from './APM';
import {
    inject,
    injectpromise,
    log,
    logCritical,
    logDebug,
    logError,
    logInfo,
    logpromise,
    logpromiseCritical,
    logpromiseDebug,
    logpromiseError,
    logpromiseInfo,
    logpromiseVerbose,
    logpromiseWarning,
    logVerbose,
    logWarning,
    measure,
    measurepromise,
    timer,
    timerpromise,
} from './decorators';
import * as Logging from './logging';
import * as Measures from './measures';
import * as Types from './shared';
import * as Sinks from './sinks';


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
    measurepromise,
};
