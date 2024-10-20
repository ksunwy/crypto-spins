import { FC } from 'react';
import { IButtonProps } from '@/shared/types/UITypes';

const Button: FC<IButtonProps> = ({children, onClick, className, ariaHasPopup, styles}) => {
  return (
    <button onClick={onClick} className={`${className} ${styles}`} role="button" aria-label={String(children)} aria-haspopup={ariaHasPopup}>
        <span>{children}</span>
    </button>
  )
}

export default Button