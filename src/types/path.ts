type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

export type Path<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<Path<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : any
) extends infer D
  ? Extract<D, string>
  : never;
