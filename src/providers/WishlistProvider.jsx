import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { mediaKey, normalizeMedia } from "../utils/media";

export const WishlistContext = createContext(null);
const SAVED_KEY = "movie-pick:wishlist";
const RECENT_KEY = "movie-pick:recent";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => read(SAVED_KEY));
  const [recent, setRecent] = useState(() => read(RECENT_KEY));

  useEffect(() => localStorage.setItem(SAVED_KEY, JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem(RECENT_KEY, JSON.stringify(recent)), [recent]);

  const isSaved = useCallback(
    (item) => items.some((saved) => mediaKey(saved) === mediaKey(item)),
    [items],
  );

  const toggle = useCallback((raw, fallbackType) => {
    const item = normalizeMedia(raw, fallbackType);
    setItems((current) =>
      current.some((saved) => mediaKey(saved) === mediaKey(item))
        ? current.filter((saved) => mediaKey(saved) !== mediaKey(item))
        : [item, ...current],
    );
  }, []);

  const remove = useCallback(
    (item) => setItems((current) => current.filter((saved) => mediaKey(saved) !== mediaKey(item))),
    [],
  );

  const addRecent = useCallback((raw, fallbackType) => {
    const item = normalizeMedia(raw, fallbackType);
    setRecent((current) => [
      item,
      ...current.filter((saved) => mediaKey(saved) !== mediaKey(item)),
    ].slice(0, 10));
  }, []);

  const value = useMemo(
    () => ({ items, recent, isSaved, toggle, remove, clear: () => setItems([]), addRecent }),
    [items, recent, isSaved, toggle, remove, addRecent],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
