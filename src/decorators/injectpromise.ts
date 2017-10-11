import {IPreInjectFunction, IPostInjectFunction} from './IInjectFunctions';

/**
 * inject decorator for promise-based operations
 * 
 * @export
 * @param {string} [name] 
 * @param {IPreInjectFunction} [pre] 
 * @param {IPostInjectFunction} [post] 
 * @returns 
 */
export function injectpromise(name?:string, pre?:IPreInjectFunction, post?:IPostInjectFunction) {
    return (target:Object, propertyKey:string, descriptor:TypedPropertyDescriptor<any>) => {
        let nm:string = (name) ? name : [target.constructor.name, descriptor.value.name].join('.');
        const originalMethod =descriptor.value;
        descriptor.value = function(...args:any[]){
            try {
                let newArgs:any[] = args;
                if(pre  && typeof(pre) === 'function') {
                    newArgs = pre(nm, args);
                } else {
                    newArgs = args;
                }
                const result = originalMethod.apply(this, newArgs);
                if(result && result.then) {
                    return result.then((val:any) => {
                        let newVal:any = val;
                        if(post && typeof(post) === 'function') {
                            newVal = post(nm, val);
                        }
                        return newVal;
                    }).catch((ex:any) => {
                        throw ex;
                    });
                } else {
                    throw new Error('could not evaluate promise');
                }
            } catch (ex) {
                throw ex;
            }
        };
    };
}
