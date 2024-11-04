import DashboardTile from '@/components/DashboardTile';
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Account Value Overview */}
      <DashboardTile/>

      {/* Recent Activity */}
      <div className="col-span-12 md:col-span-4 lg:col-span-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        {/* Insert recent transactions or activity log here */}
      </div>

      {/* Change Charts */}
      <div className="col-span-12 md:col-span-6 lg:col-span-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">Value Change Chart</h2>
        {/* Insert change chart here */}
      </div>

      {/* Holdings Summary */}
      <div className="col-span-12 md:col-span-6 lg:col-span-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">Holdings Summary</h2>
        {/* Insert holdings summary here */}
      </div>

      {/* News and Updates */}
      <div className="col-span-12 lg:col-span-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">News and Updates</h2>
        {/* Insert news or updates feed here */}
      </div>
    </div>
  );
}
