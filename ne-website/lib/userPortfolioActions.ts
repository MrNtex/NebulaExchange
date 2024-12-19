import { UserData } from "@/context/authcontext";

/// <summary>
/// Returns userDataObj with the coin add to the user's portfolio
/// </summary>
/// <param name="userDataObj">The user's data object</param>
/// <param name="id">The coin's id</param>
/// <param name="amount">The amount of coins</param>
/// <param name="price">The price of the coin</param>
export function AddCoin(userDataObj: UserData, id: string, amount: number, price: number) {
  const newCoin = { id, amount, price }
  userDataObj.coins.push(newCoin)
  return userDataObj
}

/// <summary>
/// Returns userDataObj with the coin removed from the user's portfolio
/// </summary>
/// <param name="userDataObj">The user's data object</param>
/// <param name="id">The coin's id</param>
export function RemoveCoin(userDataObj: UserData, id: string) {
  userDataObj.coins = userDataObj.coins.filter(coin => coin.id !== id)
  return userDataObj
}

export function AddToFavorites(userDataObj: UserData, id: string) {
  userDataObj.favoritesSet.add(id)
  return userDataObj
}

export function RemoveFromFavorites(userDataObj: UserData, id: string) {
  userDataObj.favoritesSet.delete(id)
  return userDataObj
}