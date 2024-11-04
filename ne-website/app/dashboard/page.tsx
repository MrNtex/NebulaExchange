import { PieChartComposition } from '@/components/charts/pie-chart';
import DashboardTile from '@/components/DashboardTile';
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-28 gap-4 p-4">
      {/* Account Value Overview */}
      <DashboardTile colSpan={8} title='Account Value'>
        <div>
            fdsfs
        </div>
      </DashboardTile>

      <DashboardTile colSpan={4} title='Recent Activity'>
        <div>
            fdsfs
        </div>
      </DashboardTile>

      <DashboardTile colSpan={4} title='Value Change Chart'>
        <div>
            fdsfs
        </div>
      </DashboardTile>

      <DashboardTile colSpan={12} title='Holdings Summary'>
        <div>
            fdsfs
        </div>
      </DashboardTile>

      <DashboardTile colSpan={12} title='Composition'>
        <div>
            <PieChartComposition />
        </div>
      </DashboardTile>
    </div>
  );
}
