type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

export type Path<T> = (
  0 extends 1 & T
    ? any
    : T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<Path<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;
