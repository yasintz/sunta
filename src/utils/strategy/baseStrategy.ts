export class Strategy<T> {
  private storage: Storage;

  protected _isCreated!: boolean;

  protected key: string;

  protected initialValue: T;

  constructor(key: string, initialValue: T, storage: Storage) {
    this.key = `__${key.split(' ').join('_')}__`.toUpperCase();
    this.initialValue = initialValue;
    this.storage = storage;
    this.getItem = this.getItem.bind(this);
    this.setItem = this.setItem.bind(this);
  }

  getItem(): T {
    try {
      const item = this.storage.getItem(this.key);
      if (!item) {
        return this.initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      return this.initialValue;
    }
  }

  setItem(value: T) {
    try {
      this.storage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    }
  }

  get isCreated(): boolean {
    if (typeof this._isCreated !== 'boolean') {
      this._isCreated = this.getItem() !== this.initialValue;
    }
    return this._isCreated;
  }
}

export default Strategy;
