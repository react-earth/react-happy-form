export type PromiseAble<T> = T | Promise<T>;
export type Override<T, U> = Omit<T, keyof U> & U;
