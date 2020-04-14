import React from 'react';
import { Strategy } from '../utils/strategy';

function useStrategy<T>(strategy: Strategy<T>) {
  const [storedValue, setStoredValue] = React.useState<T>(
    strategy.getItem()
  );

  const setValue = React.useCallback(
    (value: React.SetStateAction<T>) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      strategy.setItem(valueToStore);
    },
    [strategy, storedValue]
  );

  return [storedValue, setValue] as const;
}

export default useStrategy;
