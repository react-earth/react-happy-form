export type FormField = {
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error: any;
};

export type FormErrors = { [key: string]: any };
