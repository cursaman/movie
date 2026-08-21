import { useCallback, useEffect, useState } from "react";
import { getList } from "../api/tmdb";
import { EmptyState, ErrorMessage, Loading } from "../components/Feedback";
import { MediaGrid, SectionTitle } from "../components/Media";

const SORTS = [
  ["popularity.desc", "인기순"],
  ["vote_average.desc", "평점순"],
  ["primary_release_date.desc", "최신순"],
];

export default function Explore({ mediaType }) {
  const isTv = mediaType === "tv";
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getList(`/genre/${mediaType}/list`).then((data) => setGenres(data.genres)).catch(() => setGenres([]));
  }, [mediaType]);

  const load = useCallback(async (nextPage = 1, append = false) => {
    setLoading(true); setError("");
    try {
      const data = await getList(`/discover/${mediaType}`, {
        page: nextPage, sort_by: sort, with_genres: genre || undefined,
        include_adult: false, vote_count_gte: sort === "vote_average.desc" ? 100 : undefined,
      });
      setItems((current) => append ? [...current, ...data.results] : data.results);
      setTotalPages(Math.min(data.total_pages, 500));
      setPage(nextPage);
    } catch (err) { setError(err.response?.data?.status_message || err.message); }
    finally { setLoading(false); }
  }, [genre, mediaType, sort]);

  useEffect(() => { load(1); }, [load]);

  return (
    <div className="page container">
      <SectionTitle eyebrow={isTv ? "TV SHOWS" : "MOVIES"} title={isTv ? "TV 프로그램 탐색" : "영화 탐색"} description="장르와 정렬 기준을 골라 취향에 맞는 작품을 찾아보세요." />
      <div className="filters">
        <label>장르<select value={genre} onChange={(event) => setGenre(event.target.value)}><option value="">전체 장르</option>{genres.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>정렬<select value={sort} onChange={(event) => setSort(event.target.value)}>{SORTS.map(([value, label]) => <option key={value} value={isTv && value.includes("primary") ? "first_air_date.desc" : value}>{label}</option>)}</select></label>
      </div>
      {error ? <ErrorMessage message={error} onRetry={() => load(1)} /> : items.length ? <MediaGrid items={items} mediaType={mediaType} /> : !loading && <EmptyState />}
      {loading && <Loading label="목록을 불러오는 중" />}
      {!loading && page < totalPages && <div className="center"><button className="button secondary" onClick={() => load(page + 1, true)}>더 보기</button></div>}
    </div>
  );
}
