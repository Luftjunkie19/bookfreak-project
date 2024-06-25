'use client';

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

export function PrimeReact({children}: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider>
      {children}
    </PrimeReactProvider>
  )
}