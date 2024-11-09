// app/test/page.tsx
import React from 'react';

export default async function Page() {
  // Fetch data directly inside the server component
  const response = await fetch('https://localhost:5001/api/coins');
  const coins = await response.json();

  return (
    <div>
      <h1>Coins</h1>
      <ul>
        {coins.map((coin: { id: string; name: string }) => (
          <li key={coin.id}>{coin.name}</li>
        ))}
      </ul>
    </div>
  );
}
