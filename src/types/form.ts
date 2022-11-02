import { Path } from './path';

export type FormField = {
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
};

export type FormErrors<T> = {
  [K in Path<T>]?: any;
};