import { Link } from "react-router-dom";
export default function NotFound() { return <div className="page container status"><span className="big-code">404</span><h1>페이지를 찾을 수 없습니다.</h1><Link className="button" to="/">홈으로 돌아가기</Link></div>; }
