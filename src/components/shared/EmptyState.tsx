import type { ReactNode } from 'react';
import Link from 'next/link';
import { buttonClasses } from './Button';
import { Icon, type IconName } from './Icon';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  text?: string;
  action?: { href: string; label: string };
  children?: ReactNode;
}

export function EmptyState({ icon = 'compass', title, text, action, children }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={40} className="empty-state__icon" />
      <h3 className="empty-state__title">{title}</h3>
      {text && <p className="empty-state__text">{text}</p>}
      {action && <Link className={buttonClasses({ variant: 'outline', size: 'sm' })} href={action.href}>{action.label}</Link>}
      {children}
    </div>
  );
}
