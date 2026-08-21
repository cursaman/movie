import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";

const links = [
  ["/", "홈"],
  ["/movies", "영화"],
  ["/tv", "TV"],
  ["/recommend", "오늘 뭐 보지?"],
  ["/wishlist", "보관함"],
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const { items } = useWishlist();
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="container header-inner">
          <NavLink to="/" className="brand" aria-label="무비픽 홈">
            <span>▶</span> 무비픽
          </NavLink>
          <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="메뉴 열기">☰</button>
          <nav className={`nav ${open ? "open" : ""}`}>
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => isActive ? "active" : ""}>
                {label}{to === "/wishlist" && items.length > 0 && <b className="count">{items.length}</b>}
              </NavLink>
            ))}
            <NavLink to="/search" className="search-link">검색</NavLink>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="container">
          <strong>무비픽</strong>
          <p>좋아할 작품을 발견하고, 비교하고, 보관하세요.</p>
          <small>이 제품은 TMDB API를 사용하지만 TMDB가 보증하거나 인증하지 않습니다.</small>
        </div>
      </footer>
    </div>
  );
}
