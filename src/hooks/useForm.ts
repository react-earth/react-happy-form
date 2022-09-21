import { useEffect } from 'react';
import { useState } from 'react';
import get from 'lodash/fp/get';
import set from 'lodash/fp/set';
import { Path } from '../types';
import _set from '../utils/_set';
import _get from '../utils/_get';
import isDateObject from '../utils/isDateObject';


type UseFormOptions<T> = {
  defaultValues?: T;
};

export type Field = {
  value: any;
  onChange: (value: any) => void;
};
export type Form<T = any> = ReturnType<typeof useForm<T>>;

export const useForm = <T = any>(options?: UseFormOptions<T>) => {
  const { defaultValues } = options || {};
  useEffect(()=>{
    const obj ={
      first:111,
      first1:{second:1},
      first2:[1,'w'],
      first3:{second:null}
    }
    const arrObj = {}
 
    const setting=_set(obj,'first4.second.third.fourth.fifth',new Date())
    const settingArr=_set(arrObj,'first.second',1)
    const getting = _get(setting,'first4.second.third.fourth.fifth')
    console.log(isDateObject(getting),'getting');
    console.log(new Date());
    
    console.log(obj,'obj');
    console.log(setting,'setting');
    console.log(settingArr,'settingArr');

    

  },[])
  
  const [values, setValues] = useState<T | undefined>(defaultValues);

  const setValue = (path: Path<T>, value: any) => {
    setValues((values?: T) => _set(values as any, path, value) as any);
  };

  return {
    field: (path: Path<T>): Field => ({
      value: _get(values as any,path) as any,
      onChange: (value: any) => setValue(path, value),
    }),
    values,
    setValue,
    setValues,
  };
};
