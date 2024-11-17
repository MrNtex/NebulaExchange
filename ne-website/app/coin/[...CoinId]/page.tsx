'use client'

import { useParams } from "next/navigation";
const Post = () => {
  const params = useParams();
  const pid = params.CoinId;
  if (!pid) return null;

  const coinId = pid[0];

  return <p>Post: {coinId}</p>
}

export default Post
