"use client";

import { useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import styles from "./FormField.module.css";

type BaseProps = {
  label: string;
  error?: string;
};
export type SelectOption = { value: string; label: string; disabled?: boolean };
export type FormFieldProps = BaseProps & (
  | (InputHTMLAttributes<HTMLInputElement> & { as?: "input"; options?: never })
  | (SelectHTMLAttributes<HTMLSelectElement> & { as: "select"; options: readonly SelectOption[]; placeholder?: string })
);

export default function FormField(props: FormFieldProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = `${id}-error`;
  const description = [props["aria-describedby"], props.error ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  let control;

  if (props.as === "select") {
    const { as: element, label, error, options, placeholder = "Pilih opsi", className = "", ...rest } = props;
    control = (
      <select
        {...rest}
        id={id}
        className={`${styles.control} ${className}`}
        aria-invalid={error ? true : rest["aria-invalid"]}
        aria-describedby={description}
        defaultValue={rest.value === undefined ? (rest.defaultValue ?? "") : undefined}
        data-control={element}
        aria-label={rest["aria-label"] ?? label}
      >
        <option value="" disabled={rest.required}>{placeholder}</option>
        {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      </select>
    );
  } else {
    const { as: element, label, error, options, className = "", ...rest } = props;
    control = (
      <input
        {...rest}
        id={id}
        type={rest.type ?? "text"}
        className={`${styles.control} ${className}`}
        aria-invalid={error ? true : rest["aria-invalid"]}
        aria-describedby={description}
        aria-label={rest["aria-label"] ?? label}
        data-control={element ?? "input"}
      />
    );
    void options;
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{props.label}</label>
      {control}
      {props.error && <p id={errorId} className={styles.error} role="alert">{props.error}</p>}
    </div>
  );
}