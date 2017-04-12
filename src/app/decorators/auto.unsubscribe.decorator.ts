export function AutoUnsubscribe(blackList = []) {

  return function (constructor) {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function () {
      for (const prop in this) {
        if (this.hasOwnProperty(prop)) {
          const property = this[prop];
          if (blackList.indexOf(prop) === -1) {
            if (property && (typeof property.unsubscribe === 'function')) {
              property.unsubscribe();
            }
          }
        }
      }
      // tslint:disable-next-line:no-unused-expression
      original && typeof original === 'function' && original.apply(this, arguments);
    };
  };

}
