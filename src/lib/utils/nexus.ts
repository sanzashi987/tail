import { RecoilValue, RecoilState, useRecoilCallback } from 'recoil';
import { useImperativeHandle, forwardRef } from 'react'

export const RecoilNexus = forwardRef(function (props, ref) {
  const get = useRecoilCallback<[atom: RecoilValue<any>], any>(({ snapshot }) =>
    function <T>(atom: RecoilValue<T>) {
      return snapshot.getLoadable(atom).contents
    }, [])

  const getPromise = useRecoilCallback<[atom: RecoilValue<any>], Promise<any>>(({ snapshot }) =>
    function <T>(atom: RecoilValue<T>) {
      return snapshot.getPromise(atom)
    }, [])

  const set = useRecoilCallback(({ set }) => set, [])

  const reset = useRecoilCallback(({ reset }) => reset, [])

  useImperativeHandle(ref, () => ({
    getRecoil: get,
    getRecoilPromise: getPromise,
    setRecoil: set,
    resetRecoil: reset
  }), [])

  return null
})