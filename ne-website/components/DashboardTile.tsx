'use client';
import React, { ReactNode } from 'react';
import styles from './DashboardTile.module.css';

interface DashboardTileProps {
  colSpan?: number;
  mdColSpan?: number;
  lgColSpan?: number;
  title?: string;
  children: ReactNode;
}

export default function DashboardTile({
  colSpan = 12,
  mdColSpan = colSpan/2,
  lgColSpan = colSpan/3,
  title,
  children,
}: DashboardTileProps) {
  const handleMouseMove = (event: React.MouseEvent) => {
    const card = event.currentTarget as HTMLDivElement;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  // Dynamically construct the column classes based on props
  const colClasses = `col-span-${colSpan} md:col-span-${mdColSpan} lg:col-span-${lgColSpan}`;

  return (
    <div
      className={`${styles.dashboardCard} ${colClasses} rounded-lg shadow-md p-4`}
      onMouseMove={handleMouseMove}
    >
      <h2 className="text-xl font-semibold text-white p-4">{title}</h2>
      {children}
    </div>
  );
}
