import { Link } from "react-router-dom";
import { imageUrl } from "../api/tmdb";
import { useWishlist } from "../hooks/useWishlist";
import { detailPath, normalizeMedia, yearOf } from "../utils/media";

export function ImageWithFallback({ path, alt, className = "" }) {
  return path
    ? <img className={className} src={imageUrl(path)} alt={alt} loading="lazy" />
    : <div className={`image-fallback ${className}`} aria-label={`${alt} 이미지 없음`}>🎬</div>;
}

export function MediaCard({ item: raw, mediaType }) {
  const item = normalizeMedia(raw, mediaType);
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(item);
  return (
    <article className="media-card">
      <Link to={detailPath(item)} className="poster-wrap">
        <ImageWithFallback path={item.posterPath} alt={item.title} />
        <span className="type-badge">{item.mediaType === "tv" ? "TV" : "영화"}</span>
        <span className="rating">★ {item.rating.toFixed(1)}</span>
      </Link>
      <div className="card-body">
        <Link to={detailPath(item)}><h3>{item.title}</h3></Link>
        <div className="card-meta"><span>{yearOf(item.date)}</span><span>{item.mediaType === "tv" ? "시리즈" : "영화"}</span></div>
        <button className={`save-button ${saved ? "saved" : ""}`} onClick={() => toggle(item)}>
          {saved ? "♥ 보관 중" : "♡ 보관하기"}
        </button>
      </div>
    </article>
  );
}

export function MediaGrid({ items, mediaType }) {
  return <div className="media-grid">{items.map((item) => <MediaCard key={`${item.media_type || mediaType}-${item.id}`} item={item} mediaType={mediaType} />)}</div>;
}

export function SectionTitle({ eyebrow, title, description, link, linkLabel = "전체 보기" }) {
  return (
    <div className="section-head">
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>
      {link && <Link className="text-link" to={link}>{linkLabel} →</Link>}
    </div>
  );
}
