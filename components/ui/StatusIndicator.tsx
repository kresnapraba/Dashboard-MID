import type { HTMLAttributes } from "react";
import styles from "./UI.module.css";

export type Status = "ok" | "warning" | "error" | "info";
export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status;
  label?: string;
}
const labels: Record<Status, string> = { ok: "OK", warning: "Warning", error: "Error", info: "Info" };

export default function StatusIndicator({ status, label, className = "", ...props }: StatusIndicatorProps) {
  return (
    <span role="status" {...props} className={`${styles.status} ${styles[status]} ${className}`}>
      <span aria-hidden="true" className={styles.dot} />
      {label ?? labels[status]}
    </span>
  );
}