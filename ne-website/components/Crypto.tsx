'use server';

import coins from '../data/coins';

let timeStamp = 0;

export async function getServerSideProps() {
  const now = Date.now();
  const minute = 60 * 1000;

  if (now - timeStamp < minute) {
    return { props: coins };
  }


  await Promise.all(coins.map(async (element) => {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${element.api}&vs_currencies=usd`);
    const data = await response.json();
    element.price = data[element.api].usd;
  }));

  

  return { props: coins };
}