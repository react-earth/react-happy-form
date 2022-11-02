type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

export type DotPath<T> = T extends never
  ? any
  : (
      T extends Array<infer V>
        ? '' | `${number}${DotPrefix<DotPath<V>>}`
        : T extends object
        ? {
            [K in Exclude<keyof T, symbol>]:
              | ''
              | `${K}${DotPrefix<DotPath<T[K]>>}`;
          }[Exclude<keyof T, symbol>]
        : ''
    ) extends infer P
  ? Extract<P, string>
  : never;

export type Path<T> = DotPath<T> extends '' ? any : Exclude<DotPath<T>, ''>;
