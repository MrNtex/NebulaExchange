import { PieChartComposition } from '@/components/charts/pie-chart';
import DashboardTile from '@/components/DashboardTile';
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <DashboardTile title="Visitors" colSpan={1}>
          <PieChartComposition />
        </DashboardTile>

        <DashboardTile title="Visitors" colSpan={12}>
          sdad
        </DashboardTile>
    </div>
  );
}
