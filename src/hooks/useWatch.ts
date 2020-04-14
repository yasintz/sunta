import React from 'react';

type Callback<T> = (prevVal: T, newVal: T) => void | (() => void | undefined);

export default function useWatch<T>(
  fn: Callback<T>,
  value: T,
  callOnCreate = false
) {
  const willUnMountRef = React.useRef<any>();
  const isCallOnCreate = React.useRef<boolean>(false);
  const currentValRef = React.useRef<T>(value);
  const ref = React.useRef<T>();

  const willUnMount = willUnMountRef.current;

  React.useEffect(() => {
    if (
      currentValRef.current !== value ||
      (callOnCreate && !isCallOnCreate.current)
    ) {
      if (willUnMountRef.current) {
        willUnMountRef.current();
      }

      ref.current = currentValRef.current;
      currentValRef.current = value;
      willUnMountRef.current = fn(ref.current, currentValRef.current);
      isCallOnCreate.current = true;
    }
  }, [value, fn, callOnCreate]);

  React.useEffect(() => {
    return willUnMount;
  }, [willUnMount]);
}
