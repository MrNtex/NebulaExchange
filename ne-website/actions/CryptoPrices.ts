// app/components/CryptoPrices.js

import axios from 'axios';
import React from 'react';

// Function to fetch prices from the CoinGecko API
const fetchCryptoPrices = async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: 'bitcoin,ethereum,cardano', // Specify the crypto IDs you want to fetch
      vs_currencies: 'usd',
    },
  });
  return response.data;
};
