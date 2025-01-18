import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCoin } from '@/context/coinContext'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { formatNumber, roundTo } from '@/lib/numberUtils'


export default function AddToPortfolioCard() {
  const { coin } = useCoin()

  const [amount, setAmount] = React.useState(0)
  const [width, setWidth] = React.useState(0)
  useEffect(() => {
    const targetWidth = String(amount * coin?.market_data.current_price?.usd).length + 3;
    setWidth(0);
    if (amount > 0) {
      
      setTimeout(() => {
        const intervalId = setInterval(() => {
          setWidth((prevWidth) => {
            if (prevWidth + 1 >= targetWidth) {
              clearInterval(intervalId); // Stop incrementing once the target is reached
              return targetWidth;
            }
            return prevWidth + 1;
          });
        }, 50)
      }, 50);
      
    }
  }, [amount]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and a single dot
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(parseFloat(value) || 0);
    }
    
  }


  return (
    <div className='w-screen h-screen absolute top-0 left-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <Card className='bg-zinc-950'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Image src={coin?.image?.small} width={24} height={24} alt={`${coin?.name} icon`} />
             Add {coin?.name} To Your Portfolio
            </CardTitle>
          <CardDescription>
            You can see tracked coins on your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2 p-4'>
            <Input 
              className={`transition-all duration-300 ${amount > 0 ? 'w-1/2' : 'w-full'}`} 
              placeholder='Amount' 
              value={amount}
              onChange={handleInput} 
            /> 
            <span className='text-gray-400 flex mr-1'> {coin?.symbol.toUpperCase()}
              <span className={`transition duration-300 ${amount > 0 ? '' : 'hidden'} after:block`}>
                {width > 0 && ` ≈ ${formatNumber(roundTo(amount * coin?.market_data.current_price?.usd, 2), 'USD').slice(0, width)}`}
              </span>
            </span>
            
            
          </div>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  )
}
