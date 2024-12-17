import { Input } from '@/components/ui/input'
import { useCoin } from '@/context/coinContext';
import { ArrowDownUp } from 'lucide-react'
import React, { useState } from 'react'

export default function CoinConverter() {
  const [topValue, setTopValue] = useState(''); // Value of top input
  const [bottomValue, setBottomValue] = useState(''); // Value of bottom input
  const [isSwapped, setIsSwapped] = useState(false); // Tracks if conversion is swapped

  const { coin } = useCoin();

  const currencyTag = coin?.symbol.toUpperCase();
  const conversionRate = coin?.market_data.current_price?.usd || 1;

  // Handles input and calculates conversion
  function handleTopInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTopValue(value);

    if (!isNaN(Number(value))) {
      const convertedValue = isSwapped
        ? Number(value) * conversionRate // BTC → USD
        : Number(value) / conversionRate; // USD → BTC
      setBottomValue(!isSwapped ? convertedValue.toFixed(6) : convertedValue.toFixed(2)); // Limit to 2 decimal places for USD
    } else {
      setBottomValue('');
    }
  }

  // Swaps the conversion direction
  function handleSwap() {
    setIsSwapped((prev) => !prev);

    // Swap the values with recalculation
    if (!isNaN(Number(topValue))) {
      const convertedValue = isSwapped
        ? Number(topValue) / conversionRate // USD → BTC
        : Number(topValue) * conversionRate; // BTC → USD
      setBottomValue(topValue);
      setTopValue(convertedValue.toFixed(6));
    }
  }

  return (
    <div className='w-64 border rounded-md p-4'>
      <h1 className='mb-4 text-xl'>🪙 Coin Converter</h1>
      <div className='items-center justify-center flex flex-col gap-4 mt-4'>
        {/* Top Input */}
        <div className='flex items-center justify-between gap-2 w-full'>
          <Input
            placeholder='Amount'
            className='w-28'
            value={topValue}
            onChange={handleTopInput}
          />
          <span>{isSwapped ? currencyTag : '$'}</span>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className='flex items-center justify-center bg-zinc-800 rounded-md p-2 hover:bg-zinc-700 transition'
        >
          <ArrowDownUp size={24} color='#a2a2a2' />
        </button>

        {/* Bottom Input */}
        <div className='flex items-center justify-between gap-2 w-full'>
          <Input
            placeholder='Amount'
            className='w-28'
            value={bottomValue}
            readOnly
          />
          <span>{isSwapped ? '$' : currencyTag}</span>
        </div>
      </div>
    </div>
  )
}
