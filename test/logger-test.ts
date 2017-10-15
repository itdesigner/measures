
import {assert} from 'chai';
import {Logger} from '../src/logging';
import {IKeyValueTag, ILogMessage, LogLevel, Tag} from '../src/shared';
import {ISink} from '../src/sinks';
import {MockSink} from './mock-sink';
import {sinkIsArray, sinkIsFunction} from './utilities';


function getMockSink(): ISink[] {
    return new Array(new MockSink());
}
function getTags(): Tag[] {
    return [
        'tag1',
        {tag2: 'val2'},
    ];
}

let functionSinkItems: any[] = [];

function functionSink(item: any) {
    functionSinkItems.push(item);
}

describe('logger', function() {
    describe('logger constructors', function() {
        it('create a default logger with only a name and mocksink', function() {
            const c = new Logger('test-logger', getMockSink());
            assert.exists(c, 'logger does not exist (null or undefined)');
            assert.equal(c.context, 'test-logger', 'incorrect logger context');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
        });
        it('create a default logger with only a name and sink function', function() {
            const c = new Logger('test-logger', functionSink);
            assert.exists(c, 'logger does not exist (null or undefined)');
            assert.equal(c.context, 'test-logger', 'incorrect logger context');
            assert.isTrue(sinkIsFunction(c.sinks), 'sink should be a function');
        });
        it('create a default logger with only a name and a single', function() {
            const m = new MockSink();
            const c = new Logger('test-logger', m);
            assert.exists(c, 'logger does not exist (null or undefined)');
            assert.equal(c.context, 'test-logger', 'incorrect logger context');
            assert.equal(c.sinks, m, 'sink is incorrect');
        });
        it('create a logger with Tags', function() {
            const c = new Logger('test-logger', getMockSink(), getTags());
            assert.exists(c, 'logger does not exist (null or undefined)');
            assert.equal(c.context, 'test-logger', 'incorrect logger context');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
            assert.isTrue(Array.isArray(c.tags), 'invalid tags');
        });
        it('create a logger with string Tags', function() {
            const c = new Logger('test-logger', getMockSink(), 'test-tag');
            assert.exists(c, 'logger does not exist (null or undefined)');
            assert.equal(c.context, 'test-logger', 'incorrect logger context');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
            assert.equal(c.tags, 'test-tag', 'tags dont match');
        });
        it('create a logger with KVP Tags', function() {
            const t: IKeyValueTag = {test: 'tag'};
            const c = new Logger('test-logger', getMockSink(), t);
            assert.exists(c, 'logger does not exist (null or undefined)');
            assert.equal(c.context, 'test-logger', 'incorrect logger context');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
            assert.equal(c.tags, t, 'invalid tags');
        });
    });
    describe('logger property getters and setters', function() {
        it('set and get tags', function() {
            const t = getTags();
            const c = new Logger('test-logger', getMockSink(), t);
            assert.exists(c, 'logger does not exist (null or undefined)');
            assert.equal(c.context, 'test-logger', 'incorrect logger context');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
            assert.equal(c.tags, t, 'tags dont match expected');
            c.tags = 'replacement tag';
            assert.equal(c.tags, 'replacement tag', 'set tags dont match expected');
        });
        it('set and get context', function() {
            const c = new Logger('test-logger', getMockSink(), getTags());
            assert.exists(c, 'logger does not exist (null or undefined)');
            assert.equal(c.context, 'test-logger', 'incorrect logger context');
            assert.isTrue(sinkIsArray(c.sinks), 'invalid sink type');
            c.context = 'replacement context';
            assert.equal(c.context, 'replacement context', 'set context dont match expected');
        });
    });
    describe('logger functions', function() {
        it('execute a generic log statement', function() {
            const s = new MockSink();
            const c = new Logger('test-logger', new Array<ISink>(s));
            c.log(LogLevel.INFO, 'log msg');
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.INFO, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a verbose log statement', function() {
            const s = new MockSink();
            const c = new Logger('test-logger', new Array<ISink>(s));
            c.verbose('log msg');
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.VERBOSE, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a debug log statement', function() {
            const s = new MockSink();
            const c = new Logger('test-logger', new Array<ISink>(s));
            c.debug('log msg');
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.DEBUG, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a info log statement', function() {
            const s = new MockSink();
            const c = new Logger('test-logger', new Array<ISink>(s));
            c.info('log msg');
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.INFO, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a warn log statement', function() {
            const s = new MockSink();
            const c = new Logger('test-logger', new Array<ISink>(s));
            c.warn('log msg');
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.WARNING, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a error log statement', function() {
            const s = new MockSink();
            const c = new Logger('test-logger', new Array<ISink>(s));
            c.error('log msg');
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.ERROR, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a critical log statement', function() {
            const s = new MockSink();
            const c = new Logger('test-logger', new Array<ISink>(s));
            c.critical('log msg');
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.CRITICAL, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a critical log statement with an error', function() {
            const s = new MockSink();
            const e = new Error('somethng bad happened');
            const c = new Logger('test-logger', new Array<ISink>(s));
            c.critical('log msg', e);
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.CRITICAL, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a critical log statement to a single sink', function() {
            const s = new MockSink();
            const c = new Logger('test-logger', s);
            c.critical('log msg');
            assert.equal(s.messageCount, 1, 'should only have been a single message');
            const m = (s.sinkData.pop()) as ILogMessage;
            assert.equal(m.level, LogLevel.CRITICAL, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a critical log statement to a sink function', function() {
            const c = new Logger('test-logger', functionSink);
            c.critical('log msg');
            assert.equal(functionSinkItems.length, 1, 'should only have been a single message');
            const m = (functionSinkItems[0]) as ILogMessage;
            assert.equal(m.level, LogLevel.CRITICAL, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isUndefined(m.tags, 'should be no tags');
        });
        it('execute a info log statement with both root and sub tags', function() {
            functionSinkItems = [];
            const c = new Logger('test-logger', functionSink, getTags());
            c.info('log msg', 'sub tag');
            assert.equal(functionSinkItems.length, 1, 'should only have been a single message');
            const m = (functionSinkItems[0]) as ILogMessage;
            assert.equal(m.level, LogLevel.INFO, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isTrue(Array.isArray(m.tags), 'invalid tags');
            assert.equal((m.tags as Tag[]).length, 3, 'incorrect tag count');
        });
        it('execute a info log statement with only root tags', function() {
            functionSinkItems = [];
            const c = new Logger('test-logger', functionSink, getTags());
            c.info('log msg');
            assert.equal(functionSinkItems.length, 1, 'should only have been a single message');
            const m = (functionSinkItems[0]) as ILogMessage;
            assert.equal(m.level, LogLevel.INFO, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isTrue(Array.isArray(m.tags), 'invalid tags');
            assert.equal((m.tags as Tag[]).length, 2, 'incorrect tag count');
        });
        it('execute a info log statement with only a single root tag and sub tags collection', function() {
            functionSinkItems = [];
            const c = new Logger('test-logger', functionSink, 'root-tag');
            c.info('log msg', getTags());
            assert.equal(functionSinkItems.length, 1, 'should only have been a single message');
            const m = (functionSinkItems[0]) as ILogMessage;
            assert.equal(m.level, LogLevel.INFO, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isTrue(Array.isArray(m.tags), 'invalid tags');
            assert.equal((m.tags as Tag[]).length, 3, 'incorrect tag count');
        });
        it('execute a info log statement with only a single root tag and a single sub tag', function() {
            functionSinkItems = [];
            const c = new Logger('test-logger', functionSink, 'root-tag');
            c.info('log msg', 'sub-tag');
            assert.equal(functionSinkItems.length, 1, 'should only have been a single message');
            const m = (functionSinkItems[0]) as ILogMessage;
            assert.equal(m.level, LogLevel.INFO, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isTrue(Array.isArray(m.tags), 'invalid tags');
            assert.equal((m.tags as Tag[]).length, 2, 'incorrect tag count');
        });
        it('execute a info log statement with no context', function() {
            functionSinkItems = [];
            const c = new Logger('test-logger', functionSink, 'root-tag');
            c.info('log msg', 'sub-tag');
            assert.equal(functionSinkItems.length, 1, 'should only have been a single message');
            const m = (functionSinkItems[0]) as ILogMessage;
            assert.equal(m.level, LogLevel.INFO, 'invalid log level');
            assert.equal(m.message, '"log msg"', 'messages dont match');
            assert.equal(m.name, 'test-logger', 'name/context dont match');
            assert.isTrue(Array.isArray(m.tags), 'invalid tags');
            assert.equal((m.tags as Tag[]).length, 2, 'incorrect tag count');
        });
        it('execute a generic log statement with invalid sinks', function() {
            const c = new Logger('test-logger', (false as any));
            c.log(LogLevel.INFO, 'log msg');
        });
    });
});
