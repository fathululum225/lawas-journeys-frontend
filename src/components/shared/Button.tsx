import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'whatsapp' | 'outline-primary';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface StyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretches the button to the full width of its container. */
  block?: boolean;
  className?: string;
}

/** Class names of the .btn component (assets: styles/legacy/components.css). */
export const buttonClasses = ({ variant = 'primary', size = 'md', block = false, className }: StyleOptions = {}): string => cn(
  'btn',
  `btn--${variant}`,
  size !== 'md' && `btn--${size}`,
  block && 'btn--block',
  className,
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions;

export function Button({ variant, size, block, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, block, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleOptions;

export function ButtonLink({ variant, size, block, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, block, className })} {...props} />;
}
