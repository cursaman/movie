import { useState } from "react";
import { getList } from "../api/tmdb";
import { EmptyState, ErrorMessage, Loading } from "../components/Feedback";
import { MediaGrid, SectionTitle } from "../components/Media";

const moods = [
  ["fun", "가볍고 유쾌하게", 35],
  ["thrill", "긴장감 있게", 53],
  ["warm", "따뜻하고 뭉클하게", 18],
  ["fantasy", "현실을 벗어나", 14],
];

export default function MoviePicker() {
  const [type, setType] = useState("all");
  const [mood, setMood] = useState(moods[0][0]);
  const [time, setTime] = useState("120");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function pick(event) {
    event.preventDefault();
    setLoading(true); setError(""); setResults([]);
    const genre = moods.find(([value]) => value === mood)[2];
    const request = async (mediaType) => {
      const data = await getList(`/discover/${mediaType}`, {
        with_genres: genre, "vote_average.gte": 6.5, "vote_count.gte": 80,
        sort_by: "popularity.desc", with_runtime_lte: time, include_adult: false,
        page: Math.ceil(Math.random() * 3),
      });
      return data.results.map((item) => ({ ...item, media_type: mediaType }));
    };
    try {
      const items = type === "all"
        ? (await Promise.all([request("movie"), request("tv")])).flat()
        : await request(type);
      setResults(items.sort(() => Math.random() - 0.5).slice(0, 5));
    } catch (err) { setError(err.response?.data?.status_message || err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="page container picker-page">
      <SectionTitle eyebrow="PICK FOR ME" title="오늘 뭐 보지?" description="지금의 기분과 가능한 시간을 고르면 다섯 작품을 골라드려요." />
      <form className="picker-form" onSubmit={pick}>
        <fieldset><legend>1. 무엇을 볼까요?</legend><div className="choice-row">{[["all","상관없어요"],["movie","영화"],["tv","TV"]].map(([value,label]) => <label key={value} className={type === value ? "selected" : ""}><input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} />{label}</label>)}</div></fieldset>
        <fieldset><legend>2. 어떤 기분인가요?</legend><div className="choice-row">{moods.map(([value,label]) => <label key={value} className={mood === value ? "selected" : ""}><input type="radio" name="mood" value={value} checked={mood === value} onChange={() => setMood(value)} />{label}</label>)}</div></fieldset>
        <fieldset><legend>3. 얼마나 시간이 있나요?</legend><div className="choice-row">{[["90","90분 이내"],["120","2시간 이내"],["180","여유롭게"]].map(([value,label]) => <label key={value} className={time === value ? "selected" : ""}><input type="radio" name="time" value={value} checked={time === value} onChange={() => setTime(value)} />{label}</label>)}</div></fieldset>
        <button className="button wide" disabled={loading}>{loading ? "고르는 중…" : "내 취향 작품 고르기"}</button>
      </form>
      {loading && <Loading label="취향에 맞는 작품을 고르는 중" />}
      {error && <ErrorMessage message={error} />}
      {results.length > 0 && <section className="picker-results"><SectionTitle eyebrow="YOUR PICKS" title="이 다섯 작품은 어때요?" /><MediaGrid items={results} /></section>}
      {!loading && !error && !results.length && <EmptyState title="선택을 마치고 추천 버튼을 눌러보세요." />}
    </div>
  );
}
