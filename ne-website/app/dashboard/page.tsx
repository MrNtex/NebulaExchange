'use client'

import { fetchCryptoForUser } from '@/actions/fetchCryptoForUser';
import { PieChartComposition } from '@/components/charts/pie-chart';
import SignUp from '@/components/signup';
import Tile from '@/components/Tile';
import { useAuth } from '@/context/authcontext';
import DashboardProvider, { Token, useDashboard } from '@/context/dashboardcontext';
import { Sign } from 'crypto';
import React, { useEffect } from 'react';

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
    );
  }

function DashboardContent() {

  const { user, userDataObj} = useAuth();

  const { tokens, setTokens } = useDashboard();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        console.log('fetching crypto for user');
        const response = await fetchCryptoForUser(user!.uid) as Token[];
        console.log(response);
      }
    };

    fetchData();
  }, [user]);

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
