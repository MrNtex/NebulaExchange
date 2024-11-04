
'use client';
import React from 'react'
import styles from './DashboardTile.module.css';


export default function DashboardTile() {
    const handleMouseMove = (event: React.MouseEvent) => {
        const card = event.currentTarget as HTMLDivElement;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = ((event.clientX - left) / width) * 100;
        const y = ((event.clientY - top) / height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      };
  return (
    <div className={`${styles.dashboardCard} md:col-span-8 lg:col-span-8`} onMouseMove={handleMouseMove}>
        <h2 className="text-xl font-semibold text-white">Account Value</h2>
        {/* Insert account value graph or data here */}
    </div>
  )
}
