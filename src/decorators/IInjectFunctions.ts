
export interface IPreInjectFunction {
    (name:string, ...args:Array<any>):Array<any>;
}
export interface IPostInjectFunction {
    (name:string, args:any):any;
}