export type PromiseAble<T> = T | Promise<T>;
export type Override<T, P> = Omit<T, keyof P> & P;
