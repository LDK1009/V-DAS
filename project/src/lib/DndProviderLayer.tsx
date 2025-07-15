"use client"; // 클라이언트 컴포넌트로 설정

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function DndProviderLayer({ children }: { children: React.ReactNode }) {

  const options = {
    enableMouseEvents: true,    // 마우스 이벤트 활성화
    enableTouchEvents: true,    // 터치 이벤트 활성화
    enableKeyboardEvents: true, // 키보드 이벤트 활성화 (접근성)
    ignoreContextMenu: true,    // 우클릭 메뉴 무시
    delayTouchStart: 0         // 터치 시작 지연시간 (밀리초)
  }
  
  return <DndProvider backend={HTML5Backend} options={options}>{children}</DndProvider>;
}
