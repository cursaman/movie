import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { backdropUrl, getList, imageUrl } from "../api/tmdb";
import { EmptyState, ErrorMessage, Loading } from "../components/Feedback";
import { MediaGrid, SectionTitle } from "../components/Media";
import { useFetch } from "../hooks/useFetch";
import { useWishlist } from "../hooks/useWishlist";
import { normalizeMedia, yearOf } from "../utils/media";

export default function MediaDetail({ mediaType }) {
  const { id } = useParams();
  const { toggle, isSaved, addRecent } = useWishlist();
  const { data, loading, error, retry } = useFetch(
    () => getList(`/${mediaType}/${id}`, { append_to_response: "videos,similar,credits" }),
    [id, mediaType],
  );
  const item = data ? normalizeMedia(data, mediaType) : null;
  useEffect(() => { if (data) addRecent(data, mediaType); }, [data, mediaType, addRecent]);

  if (loading) return <Loading />;
  if (error) return <div className="page container"><ErrorMessage message={error} onRetry={retry} /></div>;
  if (!item) return <EmptyState />;
  const trailer = data.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer");
  const runtime = data.runtime || data.episode_run_time?.[0];
  const cast = data.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="detail-page">
      <section className="detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(9,9,11,.97), rgba(9,9,11,.68)), url(${backdropUrl(item.backdropPath)})` }}>
        <div className="container detail-layout">
          <img className="detail-poster" src={imageUrl(item.posterPath)} alt={`${item.title} 포스터`} />
          <div>
            <span className="eyebrow">{mediaType === "tv" ? "TV SERIES" : "MOVIE"}</span>
            <h1>{item.title}</h1>
            {item.originalTitle && <p className="original-title">{item.originalTitle}</p>}
            <div className="detail-meta"><span>★ {item.rating.toFixed(1)}</span><span>{yearOf(item.date)}</span>{runtime && <span>{runtime}분</span>}{data.status && <span>{data.status}</span>}</div>
            <div className="genre-row">{data.genres?.map((genre) => <span key={genre.id}>{genre.name}</span>)}</div>
            <p className="overview">{data.overview || "등록된 줄거리가 없습니다."}</p>
            <div className="button-row">
              <button className="button" onClick={() => toggle(item)}>{isSaved(item) ? "♥ 보관함에서 제거" : "♡ 보관하기"}</button>
              {trailer && <a className="button secondary" target="_blank" rel="noreferrer" href={`https://www.youtube.com/watch?v=${trailer.key}`}>예고편 보기</a>}
            </div>
          </div>
        </div>
      </section>
      <div className="container detail-content">
        {cast.length > 0 && <section><SectionTitle eyebrow="CAST" title="주요 출연진" /><div className="cast-list">{cast.map((person) => <div key={person.id}><div className="avatar">{person.profile_path ? <img src={imageUrl(person.profile_path, "w185")} alt={person.name} /> : "👤"}</div><strong>{person.name}</strong><small>{person.character}</small></div>)}</div></section>}
        <section><SectionTitle eyebrow="SIMILAR" title="비슷한 작품" />{data.similar?.results?.length ? <MediaGrid items={data.similar.results.slice(0, 10)} mediaType={mediaType} /> : <EmptyState title="비슷한 작품이 없습니다." />}</section>
        <Link className="text-link" to={mediaType === "tv" ? "/tv" : "/movies"}>← 목록으로</Link>
      </div>
    </div>
  );
}
