import { useContext } from "react";
import { WishlistContext } from "../providers/WishlistProvider";

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist는 WishlistProvider 안에서 사용해야 합니다.");
  return context;
}
