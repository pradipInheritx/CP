export class AdminManager<T> {
  obj: T;
  setterFunc: (obj: T) => void;
  decorator: ((settings: T) => T) | undefined;

  constructor(obj: T, setterFunc: (obj: T) => void) {
    this.obj = obj;
    this.setterFunc = setterFunc;
  }

  getter(): T {
    return this.obj;
  }

  setter(obj: T) {
    if (this.decorator) {
      obj = this.decorator(obj);
    }
    this.setterFunc(obj);
    return obj;
  }
}
