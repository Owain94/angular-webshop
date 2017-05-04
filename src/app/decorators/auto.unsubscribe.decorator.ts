export function AutoUnsubscribe(blackList: any = []) {

  return function (constructor: any) {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function () {
      if (process.env.NODE_ENV !== 'production' && typeof(window) !== 'undefined') {
        console.groupCollapsed(`${constructor.name} - Unsubscribe`);
      }
      for (const prop in this) {
        if (this.hasOwnProperty(prop)) {
          const property = this[prop];
          if (blackList.indexOf(prop) === -1) {
            if (property && (typeof property.unsubscribe === 'function')) {
              property.unsubscribe();
              if (process.env.NODE_ENV !== 'production' && typeof(window) !== 'undefined') {
                console.log('%c Unsubscribed', 'color: #7E57C2; font-weight: bold', property);
              }
            }
          }
        }
      }
      if (process.env.NODE_ENV !== 'production' && typeof(window) !== 'undefined') {
        console.groupEnd();
      }
      // tslint:disable-next-line:no-unused-expression
      original && typeof original === 'function' && original.apply(this, arguments);
    };
  };

}
