// app/components/CryptoPrices.js

import axios from 'axios';
import React from 'react';
import coins from '@/data/coins';

export const fetchCoinPrice = async (coin: keyof typeof coins) => {
  const coinData = coins[coin];

  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinData.api}&vs_currencies=usd`);
  const data = await response.json();
  return data[coinData.api]?.usd || 0;
};