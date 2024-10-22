import { FC } from 'react';
import { IButtonProps } from '@/shared/types/UITypes';

const Button: FC<IButtonProps> = ({children, onClick, className, ariaHasPopup, styles, disabled}) => {
  return (
    <button style={{opacity: disabled ? .6 : 1, pointerEvents: disabled ? "none" : "auto"}} onClick={onClick} disabled={disabled} className={`${className} ${styles}`} role="button" aria-label={String(children)} aria-haspopup={ariaHasPopup}>
        <span>{children}</span>
    </button>
  )
}

export default Button