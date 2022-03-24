import { useImperativeHandle, forwardRef } from 'react';
import { RecoilValue, useRecoilCallback } from 'recoil';

const RecoilNexus = forwardRef(function (props, ref) {
  const get = useRecoilCallback<[atom: RecoilValue<any>], any>(
    ({ snapshot }) =>
      function <T>(atom: RecoilValue<T>) {
        return snapshot.getLoadable(atom).contents;
      },
    [],
  );

  const getPromise = useRecoilCallback<[atom: RecoilValue<any>], Promise<any>>(
    ({ snapshot }) =>
      function <T>(atom: RecoilValue<T>) {
        return snapshot.getPromise(atom);
      },
    [],
  );

  const set = useRecoilCallback(({ set }) => set, []);

  const reset = useRecoilCallback(({ reset }) => reset, []);

  useImperativeHandle(
    ref,
    () => ({
      getRecoil: get,
      getRecoilPromise: getPromise,
      setRecoil: set,
      resetRecoil: reset,
    }),
    [],
  );

  return null;
});

RecoilNexus.displayName = 'RecoilNexus';

export { RecoilNexus };
