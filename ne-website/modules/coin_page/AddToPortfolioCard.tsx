import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCoin } from '@/context/coinContext'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { formatNumber, roundTo } from '@/lib/numberUtils'
import { Label } from '@/components/ui/label'
import { DatePicker } from './DatePicker'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/authcontext'
import { useToast } from '@/hooks/use-toast'
import { Token } from '@/context/dashboardcontext'


export default function AddToPortfolioCard({close} : {close: () => void}) {
  const { coin } = useCoin()
  const { user, userDataObj, setUserDataObj } = useAuth()
  const { toast } = useToast()
  

  const [amount, setAmount] = React.useState(0)
  const [width, setWidth] = React.useState(0)
  useEffect(() => {
    if (!coin || !coin?.market_data.current_price?.usd) return

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

  function handleAddToPortfolio() {
    if (!coin || !coin?.market_data.current_price?.usd || !userDataObj) return;
    const newCoin: Token = {
      name: coin.id,
      amount,
      purchased: date,
    };
    setUserDataObj({
      ...userDataObj,
      coins: [...userDataObj.coins, newCoin]
    });
    close();
    toast({
      title: "Added to Portfolio",
      description: `You have added ${amount} ${coin.symbol.toUpperCase()} to your portfolio.`,
    })
  }
  

  const [date, setDate] = React.useState(new Date())

  if (!coin || !coin.image || !coin.image.small || !coin?.market_data.current_price?.usd || !user || !userDataObj) return

  return (
    <div className='w-screen h-screen absolute top-0 left-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm' onClick={close}>
      <Card className='bg-zinc-950 w-1/4' onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 px-4 pt-4'>
            <Image src={coin?.image?.small} width={24} height={24} alt={`${coin?.name} icon`} />
             Add {coin?.name} To Your Portfolio
            </CardTitle>
          <CardDescription className='px-4'>
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
            <span className='text-gray-400 flex'> {coin?.symbol.toUpperCase()}
              <span className={`transition duration-300 ${amount > 0 ? '' : 'hidden'} after:block`}>
                {width > 0 && ` ≈ ${formatNumber(roundTo(amount * coin?.market_data.current_price?.usd, 2), 'USD').slice(0, width)}`}
              </span>
            </span>
            
            
          </div>
          <div className='flex flex-col gap-2 p-4 w-full'>
            <Label>Purchased at: </Label>
            <DatePicker date={date} setDate={setDate} />
          </div>
          
        </CardContent>
        <CardFooter>
          <div className='flex items-center justify-around w-full gap-12 p-4'>
            <Button variant='outline' className='w-full' onClick={close}>Cancel</Button>
            <Button variant='default' className='w-full' onClick={handleAddToPortfolio}>Add to Portfolio</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
