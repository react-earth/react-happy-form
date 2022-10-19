export type FormField = {
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error: any;
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;
