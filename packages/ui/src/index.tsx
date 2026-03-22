import * as React from 'react';

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{children}</h2>;
}
