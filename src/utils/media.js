export function normalizeMedia(item, fallbackType) {
  const mediaType = item.media_type || item.mediaType || fallbackType || (item.name ? "tv" : "movie");
  return {
    ...item,
    mediaType,
    title: item.title || item.name || "제목 없음",
    originalTitle: item.original_title || item.original_name || "",
    date: item.release_date || item.first_air_date || "",
    posterPath: item.poster_path || item.posterPath || "",
    backdropPath: item.backdrop_path || item.backdropPath || "",
    rating: Number(item.vote_average || item.rating || 0),
  };
}

export const mediaKey = (item) => `${item.mediaType}-${item.id}`;
export const detailPath = (item) => `/${item.mediaType}/${item.id}`;
export const yearOf = (date) => date?.slice(0, 4) || "미정";
