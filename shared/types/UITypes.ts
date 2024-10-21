import { InputHTMLAttributes, ButtonHTMLAttributes } from "react";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: string | React.ReactNode,
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string,
    ariaHasPopup?: boolean
    styles?: string,
    disabled?: boolean
}

export interface ILinkProps {
    children: string,
    href: string
    className: string,
}

export interface IPosition {
    x: number;
    y: number;
}

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string,
    min?: number,
    value: string | number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string,
}  