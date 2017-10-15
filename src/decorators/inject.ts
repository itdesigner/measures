import {IPostInjectFunction, IPreInjectFunction} from './IInjectFunctions';


/**
 * inject decorator for synchronous operations
 *
 * @export
 * @param {string} [name]
 * @param {IPreInjectFunction} [pre]
 * @param {IPostInjectFunction} [post]
 * @returns
 */
export function inject(name?: string, pre?: IPreInjectFunction, post?: IPostInjectFunction) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const nm: string = (name) ? name : [target.constructor.name, descriptor.value.name].join('.');
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]){
            try {
                let newArgs: any[] = args;
                newArgs = (pre  && typeof(pre) === 'function') ? pre(nm, args) : args;
                const result = originalMethod.apply(this, newArgs);
                let newResult: any = result;
                newResult =  (post && typeof(post) === 'function') ? post(nm, result) : newResult = result;
                return newResult;
            } catch (ex) {
                throw ex;
            }
        };
        return descriptor;
    };
}
