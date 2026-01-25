'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

interface Route {
  name: string;
  path: string;
}

interface NavigationSelectProps {
  routes: Route[];
}

export function NavigationSelect({ routes }: NavigationSelectProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  return (
    <select
      value={pathname}
      onChange={handleChange}
      className="px-4 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer min-w-[200px]"
    >
      {routes.map((route) => (
        <option key={route.path} value={route.path}>
          {route.name}
        </option>
      ))}
    </select>
  );
}
