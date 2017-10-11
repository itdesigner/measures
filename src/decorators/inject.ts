import {IPreInjectFunction, IPostInjectFunction} from './IInjectFunctions';


/**
 * inject decorator for synchronous operations
 * 
 * @export
 * @param {string} [name] 
 * @param {IPreInjectFunction} [pre] 
 * @param {IPostInjectFunction} [post] 
 * @returns 
 */
export function inject(name?:string, pre?:IPreInjectFunction, post?:IPostInjectFunction) {
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
                let newResult:any = result;
                if(post && typeof(post) === 'function') {
                    newResult = post(nm, result);
                } else {
                    newResult = result;
                }
                return newResult;
            } catch (ex) {
                throw ex;
            }
        };
        return descriptor;
    };
}
