import { Link } from "react-router-dom";
import { backdropUrl, getList, tokenIsConfigured } from "../api/tmdb";
import { ErrorMessage, Loading } from "../components/Feedback";
import { MediaGrid, SectionTitle } from "../components/Media";
import { useFetch } from "../hooks/useFetch";
import { useWishlist } from "../hooks/useWishlist";

export default function Home() {
  const { recent } = useWishlist();
  const { data, loading, error, retry } = useFetch(async () => {
    const [trending, movies, tv] = await Promise.all([
      getList("/trending/all/week"),
      getList("/movie/now_playing", { region: "KR" }),
      getList("/tv/popular"),
    ]);
    return { trending: trending.results.filter((item) => item.media_type !== "person"), movies: movies.results, tv: tv.results };
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="page container"><ErrorMessage message={error} onRetry={retry} /></div>;
  const hero = data.trending.find((item) => item.backdrop_path) || data.movies[0];

  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(9,9,11,.98) 5%, rgba(9,9,11,.55) 62%, rgba(9,9,11,.9)), url(${backdropUrl(hero.backdrop_path)})` }}>
        <div className="container hero-content">
          <span className="eyebrow">이번 주 인기 1위</span>
          <h1>{hero.title || hero.name}</h1>
          <p>{hero.overview || "지금 가장 많은 관심을 받는 작품을 만나보세요."}</p>
          <div className="button-row">
            <Link className="button" to={`/${hero.media_type || "movie"}/${hero.id}`}>상세 보기</Link>
            <Link className="button secondary" to="/recommend">취향 추천 받기</Link>
          </div>
          {!tokenIsConfigured && <p className="token-warning">.env에 VITE_TMDB_TOKEN을 설정해 주세요.</p>}
        </div>
      </section>
      <div className="container home-sections">
        <section><SectionTitle eyebrow="TRENDING" title="지금 뜨는 콘텐츠" link="/search" /><MediaGrid items={data.trending.slice(0, 10)} /></section>
        <section><SectionTitle eyebrow="MOVIES" title="현재 상영 영화" link="/movies" /><MediaGrid items={data.movies.slice(0, 10)} mediaType="movie" /></section>
        <section><SectionTitle eyebrow="TV SERIES" title="인기 TV 프로그램" link="/tv" /><MediaGrid items={data.tv.slice(0, 10)} mediaType="tv" /></section>
        {recent.length > 0 && <section><SectionTitle eyebrow="HISTORY" title="최근 본 작품" /><MediaGrid items={recent.slice(0, 5)} /></section>}
      </div>
    </>
  );
}
