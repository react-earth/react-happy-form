import { Path } from './path';

export type FormField = {
  value: any;
  onChange: (value: any) => void;
  // use for trigger touched flag
  onBlur?: () => void;
  // use for auto focus validate error field component
  ref?: any;
};

// use map (not object) to keep errors order
export type FormErrors<T> = Map<Path<T>, any>;
