import { Path } from './path';

export type StandardFieldRef = {
  focus: () => void;
};

export type StandardFieldProps<T = any> = {
  value: T;
  onChange: (value: T) => void;
  // use for validate after touched
  onBlur?: () => void;
  // use for auto focus
  ref?: any;
};

// use map (not object) to keep errors order
export type FormErrors<T> = Map<Path<T>, any>;

export type FormFieldRefs<T> = Record<Path<T>, any>;
