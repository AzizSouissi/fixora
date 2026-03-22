import * as React from 'react';

type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionTitle({ children, className }: SectionTitleProps) {
  return <h2 className={className ?? 'text-2xl font-bold'}>{children}</h2>;
}
