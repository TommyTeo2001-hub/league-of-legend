'use client';

import React from 'react';

interface TableOfContentsProps {
  children: React.ReactNode;
}

export function TableOfContents({ children }: TableOfContentsProps) {
  return (
    <nav className="sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {children}
      </ul>
    </nav>
  );
}