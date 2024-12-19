import { useAuth } from '@/context/authcontext'
import { Crown } from 'lucide-react'
import React from 'react'

export default function FavButton({ id }: { id: string }) {
  const { userDataObj, setUserDataObj } = useAuth()

  if (!userDataObj) return null // If user is not logged in, don't show the button

  function handleFavClick(remove: boolean) {
    const newFavoritesSet = new Set(userDataObj!.favoritesSet); // Create a new Set
    if (remove) {
      newFavoritesSet.delete(id);
    } else {
      newFavoritesSet.add(id);
    }
    // Update the user's data object with the new Set
    setUserDataObj({
      ...userDataObj!,
      favoritesSet: newFavoritesSet, // Use the updated Set
    });
  }


  if (userDataObj.favoritesSet.has(id)) {
    return (
      <div onClick={() => handleFavClick(true)}>
        <Crown color='#FFD700'/>
      </div>
    )
  }


  return (
    <div onClick={() => handleFavClick(false)}>
      <Crown/>
    </div>
  )
}
