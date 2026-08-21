import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/Feedback";
import { MediaGrid, SectionTitle } from "../components/Media";
import { useWishlist } from "../hooks/useWishlist";

export default function Wishlist() {
  const { items, clear } = useWishlist();
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? items : items.filter((item) => item.mediaType === filter);
  return (
    <div className="page container">
      <SectionTitle eyebrow="MY LIBRARY" title="내 보관함" description={`보고 싶은 작품 ${items.length}개를 저장했습니다.`} />
      {items.length > 0 && <div className="toolbar"><div className="tabs">{[["all","전체"],["movie","영화"],["tv","TV"]].map(([value,label]) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{label}</button>)}</div><button className="danger-link" onClick={() => confirm("보관함을 모두 비울까요?") && clear()}>전체 삭제</button></div>}
      {visible.length ? <MediaGrid items={visible} /> : <EmptyState title={items.length ? "이 분류에 저장된 작품이 없습니다." : "아직 보관한 작품이 없습니다."} description="마음에 드는 영화나 TV 프로그램의 보관 버튼을 눌러보세요." action={<Link className="button" to="/recommend">추천 받기</Link>} />}
    </div>
  );
}
