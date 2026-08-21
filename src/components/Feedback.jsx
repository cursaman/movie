import { Component } from "react";

export function Loading({ label = "콘텐츠를 불러오는 중" }) {
  return <div className="status"><span className="spinner" /><p>{label}</p></div>;
}

export function ErrorMessage({ message = "정보를 불러오지 못했습니다.", onRetry }) {
  return (
    <div className="status error">
      <strong>{message}</strong>
      <p>토큰과 네트워크 연결을 확인해 주세요.</p>
      {onRetry && <button className="button secondary" onClick={onRetry}>다시 시도</button>}
    </div>
  );
}

export function EmptyState({ title = "표시할 작품이 없습니다.", description, action }) {
  return <div className="status empty"><strong>{title}</strong>{description && <p>{description}</p>}{action}</div>;
}

export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div className="fatal"><h1>화면을 표시하지 못했습니다.</h1><button className="button" onClick={() => location.reload()}>새로고침</button></div>;
    }
    return this.props.children;
  }
}
