namespace fgui.utils {

    export class Binder {
        public static create<T extends Function>(func:Function, context:any, ...args: any[]):T {
            if(!context)
                return func as T;
            return(function():void {
                let fullargs = arguments.length > 0 ? [].concat(Array.prototype.slice.call(arguments)).concat(args) : [].concat(args);
                func.apply(context, fullargs);
            }) as Function as T;
        }
    }
}