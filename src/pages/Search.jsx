import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getList } from "../api/tmdb";
import { EmptyState, ErrorMessage, Loading } from "../components/Feedback";
import { MediaGrid, SectionTitle } from "../components/Media";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("q") || "");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const query = params.get("q")?.trim() || "";

  useEffect(() => {
    if (!query) { setItems([]); return; }
    setLoading(true); setError("");
    getList("/search/multi", { query, include_adult: false })
      .then((data) => setItems(data.results.filter((item) => ["movie", "tv"].includes(item.media_type))))
      .catch((err) => setError(err.response?.data?.status_message || err.message))
      .finally(() => setLoading(false));
  }, [query]);

  const submit = (event) => {
    event.preventDefault();
    if (input.trim()) setParams({ q: input.trim() });
  };

  return (
    <div className="page container">
      <SectionTitle eyebrow="SEARCH" title="작품 검색" description="영화와 TV 프로그램을 한 번에 검색합니다." />
      <form className="search-form" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="작품 제목을 입력하세요" autoFocus /><button className="button">검색</button></form>
      {query && <p className="result-label">‘{query}’ 검색 결과 {items.length}개</p>}
      {loading ? <Loading /> : error ? <ErrorMessage message={error} /> : items.length ? <MediaGrid items={items} /> : <EmptyState title={query ? "검색 결과가 없습니다." : "찾고 싶은 작품을 검색해 보세요."} description={query ? "다른 제목이나 짧은 검색어를 사용해 보세요." : "영화와 TV 프로그램을 모두 찾을 수 있습니다."} />}
    </div>
  );
}
