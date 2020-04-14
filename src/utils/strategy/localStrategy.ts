import Strategy from './baseStrategy';

export class LocalStrategy<T> extends Strategy<T> {
  constructor(key: string, initialValue: T) {
    super(key, initialValue, window.localStorage);
  }
}

export default LocalStrategy;
