import { useMemo } from "react";


export const useArrayKeysObject = <T extends {} = {}>(arr: T[], key: keyof T) => {
  const object = useMemo(() => {
    const res: IObject<T> = {}
    arr.forEach((item) => {
      res[item[key] as any] = item
    })
    return res
  }, [arr, key])
  return object
}


export const useObjectValuesArray = <T extends {} = {}>(obj: IObject<T>) => {

}