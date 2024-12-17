import { Button } from '@/components/ui/button';
import { useCoin } from '@/context/coinContext';
import { Facebook, Github, Link, X } from 'lucide-react'
import React from 'react'

export default function CoinCommunity() {
  const placeholderCommunity = [
    { name: 'Website', url: 'https://example.com', logo: <Link /> },
    { name: 'GitHub', url: 'https://github.com/example', logo: <Github/> },
    { name: 'Twitter', url: 'https://twitter.com/example', logo: <X /> },
    { name: 'Facebook', url: 'https://facebook.com/example', logo: <Facebook/> }
  ]

  const { coin } = useCoin();

  return (
    <div className='flex flex-col justify-around gap-4'>
      <h1 className='text-3xl font-extralight'>Community</h1>
      <div className='w-full flex gap-2 justify-around'>
        {placeholderCommunity.map((community, index) => (
          <a key={index} href={community.url} target='_blank' rel='noreferrer noopener' className='hover:underline hover:text-blue-500 flex gap-2 bg-zinc-900 p-2 rounded-md'>
            {community.logo}
            {community.name}
          </a>
        ))}
      </div>
      <h2 className='text-xl font-extralight'>How does community feel about {coin?.name} today?</h2>
      <div className='w-full h-96 bg-zinc-900 rounded-md gap-2'>
        <Button variant="outline" className='text-md text-zinc-400'>
          🚀 66.6%
        </Button>
        <Button variant="outline"  className='text-md text-zinc-400'>
          🤡 33.3%
        </Button>
      </div>
    </div>
  )
}
