import AxiosLib from 'axios';
import { isServer } from '.';
import { Strategy, MemoryStrategy, LocalStrategy } from './strategy';

const axiosInstance = AxiosLib.create({
  baseURL: 'https://ezanvakti.herokuapp.com',
});

const cache = new (class Cache {
  private _cache: Record<string, Strategy<any>> = {};
  get = (cacheKey: string, isObject: boolean) => {
    if (!this._cache[cacheKey]) {
      this._cache[cacheKey] = new (isServer ? MemoryStrategy : LocalStrategy)(
        cacheKey,
        isObject ? {} : undefined
      );
    }

    return this._cache[cacheKey];
  };
})();

async function axiosGet<T, S extends string | undefined = undefined>(
  path: string,
  optionalPrefix?: S
): Promise<S extends undefined ? T : Record<string, T>> {
  const localStorage = cache.get(path, Boolean(optionalPrefix));

  const isCreated = optionalPrefix
    ? Boolean(localStorage.getItem()[optionalPrefix])
    : localStorage.isCreated;

  if (isCreated) {
    return localStorage.getItem();
  }
  console.log(`Fetching: ${path}`);
  const apiResult = (await axiosInstance.get(path)).data;

  if (optionalPrefix) {
    localStorage.setItem({
      ...localStorage.getItem(),
      [optionalPrefix as string]: apiResult,
    });
  } else {
    localStorage.setItem(apiResult);
  }

  return localStorage.getItem();
}

export default axiosGet;
