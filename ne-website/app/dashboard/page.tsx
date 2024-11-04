import { PieChartComposition } from '@/components/charts/pie-chart';
import SignUp from '@/components/signup';
import Tile from '@/components/Tile';
import { Sign } from 'crypto';
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <Tile title="Visitors" colSpan={1}>
          <PieChartComposition />
        </Tile>

        <Tile title="Visitors" colSpan={12}>
          <SignUp/>
        </Tile>
    </div>
  );
}
