# 해인사 장경각 온라인 기와불사 MVP

## 실행
```bash
npm install
npm run dev
```

## Vercel 배포
GitHub에 업로드 후 Vercel에서 Import → Deploy.

## 실사 이미지 적용
`src/App.jsx` 상단에서:

```js
const TEMPLE_PHOTO_URL = "";
```

를 아래처럼 변경하세요.

```js
const TEMPLE_PHOTO_URL = "/temple.jpg";
```

그리고 `public/temple.jpg`에 실제 촬영/사용허가 받은 사찰 사진을 넣으면 됩니다.

## 기능
- 해인사 장경각 모티브 실사풍 화면
- 기와 360장 오버레이
- 기와 클릭/서원 등록
- 기와 코드 자동 부여
- 완성률/누적 후원액
- 대표 서원 리스트
- 모바일 반응형
