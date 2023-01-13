import React from "react";
import { Form } from "react-bootstrap";
import { FormCheckType } from "react-bootstrap/FormCheck";
import HeartSave from "../../icons/HeartSave";

export type IconProps = {
  type?: FormCheckType;
  checked: boolean;
  setChecked: (c: boolean) => void;
  name: string;
  className?: string;
  wrapperClassName?: string;
  iconOn: React.ReactNode;
  iconOff: React.ReactNode;
  id?: string;
  value?: string;
  inline?: string;
};

export type HeartProps = {
  checked: boolean;
  setChecked: (c: boolean) => void;
  name?: string;
  id?: string;
  value?: string;
  size?: number;
  color?: string;
};

const Icon = ({
  type = "checkbox",
  checked,
  setChecked,
  name,
  value,
  className,
  inline = "d-inline",
  wrapperClassName = "favorite",
  iconOn,
  iconOff,
  id,
}: IconProps) => {
  return (
    <Form.Check
      type={type}
      className={(inline || "") + (inline ? " " : "") + wrapperClassName}
      bsPrefix="checkbox-container"
      style={{ lineHeight: "16px" }}
    >
      <Form.Check.Input
        type="checkbox"
        name={name}
        value={value}
        id={id || name}
        checked={checked}
        onChange={() => {
          setChecked(!checked);
        }}
        className="d-none"
        bsPrefix="input"
      />
      <Form.Check.Label
        style={{ cursor: "pointer" }}
        htmlFor={id || name}
        className={className}
        bsPrefix="label"
      >
        {checked && iconOn}
        {!checked && iconOff}
      </Form.Check.Label>
    </Form.Check>
  );
};

export const Heart = ({
  checked,
  setChecked,
  name,
  id,
  value,
  size,
  color = "#6352e8",
}: HeartProps) => {
  return (
    <Icon
      checked={checked}
      setChecked={setChecked}
      name={name || "heart"}
      id={id}
      value={value}
      iconOn={<HeartSave on={true} color={color} size={size} />}
      iconOff={<HeartSave on={false} color={color} size={size}/>}
    />
  );
};

export default Icon;
