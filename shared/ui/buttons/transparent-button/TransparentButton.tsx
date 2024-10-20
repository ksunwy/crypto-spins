"use client";
import { FC, useState } from 'react';
import Link from "next/link";
import { ILinkProps, IPosition} from '@/shared/types/UITypes';

const TransparentButton:FC<ILinkProps> = ({href, children, className}) => {
  const [position, setPosition] = useState<IPosition>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const parentOffset = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - parentOffset.left;
    const relY = e.clientY - parentOffset.top;
    setPosition({ x: relX, y: relY });
  };
  return (
    <Link href={href} className={className} aria-label={String(children)} onMouseMove={handleMouseMove} onMouseLeave={handleMouseMove}>
      <span style={{ top: position.y, left: position.x }}></span>
      {children}
    </Link>
  )
}

export default TransparentButton