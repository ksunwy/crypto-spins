import { FC } from "react";
import { IInputProps } from "@/shared/types/UITypes.ts";
import styles from "@/styles/ui/inputs/input.module.scss";

const Input: FC<IInputProps> = ({value, onChange, className, id}) => {
  return (
    <input type="number" id={id} aria-required="true" aria-label={`${id} input`} value={value} onChange={onChange} className={`${styles.input} ${className}`} />
  )
}

export default Input