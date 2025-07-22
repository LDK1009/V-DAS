"use client";

import Script from "next/script";

export default function KakaoInitializer() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
      integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-expect-error - window.Kakao 타입이 전역에 정의되지 않음
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_SDK_KEY);
        // @ts-expect-error - window.Kakao 타입이 전역에 정의되지 않음
        console.log(window.Kakao.isInitialized());
      }}
    />
  );
}

// ✨ 위 'SDK 다운로드' 과정에서 복사한 스크립트의 src와 integrity 속성을 붙여넣기하세요.