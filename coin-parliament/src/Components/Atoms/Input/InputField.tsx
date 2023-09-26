import React from "react";
import { FormControlProps } from "react-bootstrap";
import { Input } from "../../LoginComponent/styles";

export type InputProps = Partial<FormControlProps> & {
  name: string;
  required: boolean;
  fullWidth?: boolean;
  maxlength?: string  | number;
};
const InputField = (props: InputProps) => {
  // @ts-ignore
  return <Input {...props} />;
};

export default InputField;
