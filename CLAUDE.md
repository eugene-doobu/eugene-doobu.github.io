# 간식축내는 스튜디오 - 게임 스튜디오 홍보 페이지 개발 가이드

> **최종 업데이트**: 2025년 1월  
> **프로젝트 목적**: 개인 포트폴리오 → 게임 스튜디오 홍보 페이지로 전환  
> **디자인 참고**: 크래프톤 게임 페이지 (https://www.krafton.com/games/)

---

## 📌 프로젝트 목적 및 방향성

### 기존 (변경 전)
- **목적**: 개인 게임 개발자 포트폴리오
- **타겟**: 채용 담당자, 동료 개발자
- **컨텐츠**: 개인 기술 소개, 프로젝트 나열

### 현재 (변경 후)
- **목적**: 게임 스튜디오 홍보 및 게임 마케팅
- **타겟**: 실제 플레이어, 게임 유저
- **컨텐츠**: 게임 홍보, 업데이트 소식, 이벤트 공지
- **스튜디오명**: **간식축내는 스튜디오** (Snack Eater Studio / おやつ食べるスタジオ)

---

## 🎨 디자인 시스템

### 1. 크래프톤 스타일 특징
- **대형 게임 카드**: 게임당 큰 비주얼 영역 (1200x600px 권장)
- **플랫폼 태그**: PC / 모바일 / 웹 등 플랫폼 명시
- **장르 표시**: 게임 장르를 명확하게 표시
- **상태 배지**: "플레이 가능" / "개발 중" 등 상태 표시
- **수평 레이아웃**: 이미지 + 설명을 좌우로 배치

### 2. 색상 팔레트 (기존 유지)
```css
/* Dark Theme (Default) */
--bg-primary: #0a0e27;       /* 메인 배경 */
--bg-secondary: #151932;     /* 섹션 배경 */
--bg-card: #1a1f3a;          /* 카드 배경 */
--text-primary: #e4e4e7;     /* 주요 텍스트 */
--text-secondary: #a1a1aa;   /* 보조 텍스트 */
--accent-primary: #667eea;   /* 강조 색상 1 */
--accent-secondary: #764ba2; /* 강조 색상 2 */

/* Light Theme */
--bg-primary: #f8f9fa;
--bg-secondary: #ffffff;
--text-primary: #1a1a1a;
--text-secondary: #6b7280;
```

### 3. 타이포그래피
- **브랜드 타이틀**: 4rem, 굵게, 자간 0.1em, 그라데이션
- **게임 타이틀**: 2rem, 굵게
- **장르/카테고리**: 1rem, 대문자, 강조 색상
- **설명 텍스트**: 1rem, line-height 1.8

---

## 📁 파일 구조

```
eugene-doobu.github.io/
├── index.html              # 메인 페이지 (스튜디오 홍보)
├── styles.css              # 전체 스타일 (크래프톤 스타일 추가)
├── script.js               # 인터랙션 (필터링, 테마 등)
├── i18n.js                 # 다국어 지원 시스템
├── locales/
│   ├── ko.json            # 한국어 번역
│   ├── en.json            # 영어 번역
│   └── ja.json            # 일본어 번역
├── projects/
│   └── 3daudio/
│       ├── index.html              # 게임 실행 페이지
│       ├── announcements.html      # 게임 공지사항 페이지
│       ├── announcement-style.css  # 공지사항 스타일
│       └── assets/
│           ├── img/
│           └── sound/
└── CLAUDE.md              # 이 문서
```

---

## 🎮 페이지 구성

### 1. Hero Section (스튜디오 소개)
```html
<section class="hero studio-hero">
  <h1 class="studio-title">간식축내는 스튜디오</h1>
  <p class="studio-tagline">혁신적인 게임 경험을 만드는 인디 게임 스튜디오</p>
  <p class="studio-description">새로운 기술과 창의적인 아이디어로...</p>
</section>
```
- 스튜디오명을 전면에 배치
- 개인 이름 대신 스튜디오 브랜드 강조
- "게임 둘러보기" CTA 버튼

### 2. Games Section (크래프톤 스타일)
**중요 포인트**:
- Grid 레이아웃: 이미지(1fr) + 정보(1fr)
- 큰 썸네일 이미지 (최소 1200x600px)
- 플랫폼 태그와 장르 명시
- 액션 버튼: "플레이", "소식", "문의"

### 3. News Section (게임 공지사항/이벤트)
**중요 포인트**:
- **기술 소개 아님**: 실제 게임 업데이트, 이벤트, 패치노트 등
- 배지 종류: "업데이트", "이벤트", "공지"
- Featured 뉴스는 더 큰 영역 차지
- 각 뉴스는 클릭 가능한 링크

### 4. About Section (스튜디오 소개)
**중요 포인트**:
- 개인 소개 → 스튜디오 소개
- 가치(Values): 창의성, 혁신, 열정
- 기술 스택 유지 (개발 역량 표시)

---

## 🌐 다국어 지원 시스템

### Translation Key 구조
```json
{
  "nav": {
    "games": "Games",
    "news": "News",
    "support": "Support"
  },
  "hero": {
    "studioName": "간식축내는 스튜디오",
    "tagline": "혁신적인 게임 경험을 만드는 인디 게임 스튜디오"
  },
  "games": {
    "title": "🎮 우리의 게임",
    "filterAll": "전체",
    "filterPC": "PC",
    "game3daudio": {
      "title": "3D Audio Experience",
      "genre": "인터랙티브 오디오 체험",
      "description": "...",
      "tags": ["WebGPU", "3D Audio", "Interactive"]
    }
  },
  "news": {
    "badge": {
      "update": "업데이트",
      "event": "이벤트",
      "announcement": "공지"
    }
  }
}
```

### 지원 언어
- **ko (한국어)**: 기본 언어
- **en (영어)**: 글로벌 유저
- **ja (일본어)**: 일본 시장

---

## 📢 공지사항 페이지 가이드

### 목적 변경
**Before**: 기술 설명, 개발 일지  
**After**: 게임 업데이트, 이벤트, 패치노트, 플레이어 공지

### 공지사항 구조 예시
```html
<div class="announcement-card featured">
  <div class="announcement-badge">신규 업데이트</div>
  <h2>v1.2.0 업데이트 - 새로운 사운드 추가</h2>
  <div class="announcement-meta">
    <span class="date">2025.01.15</span>
    <span class="category">업데이트</span>
  </div>
  <div class="announcement-content">
    <h3>추가된 내용</h3>
    <ul>
      <li>새로운 환경음 5종 추가</li>
      <li>3D 위치 추적 정확도 개선</li>
      <li>UI 다국어 지원</li>
    </ul>
    
    <h3>버그 수정</h3>
    <ul>
      <li>크롬에서 오디오가 재생되지 않는 문제 수정</li>
    </ul>
    
    <h3>이벤트</h3>
    <p>런칭 기념 이벤트 진행 중! [자세히 보기]</p>
  </div>
</div>
```

### 공지사항 유형
1. **업데이트 공지**: 새 기능, 버그 수정, 개선 사항
2. **이벤트**: 기간 한정 이벤트, 보상, 미션
3. **시스템 공지**: 점검, 서버 상태
4. **커뮤니티**: 플레이어 피드백, FAQ

---

## 🚀 새 게임 추가 가이드

### 1. 프로젝트 폴더 생성
```
projects/
└── [게임명]/
    ├── index.html          # 게임 실행 페이지
    ├── announcements.html  # 공지사항 페이지
    ├── announcement-style.css
    └── assets/
        ├── img/
        │   └── thumbnail.png  (1200x600px 권장)
        └── ...
```

### 2. index.html에 게임 카드 추가

**⚠️ 중요: 최신 게임이 위에 오도록 맨 위에 추가하세요!**

```html
<!-- 새 게임은 여기에 추가 (Coming Soon 카드 위에) -->

<!-- Game Card: [새 게임 이름] (2025.XX) -->
<div class="game-card" data-platforms="pc mobile">
  <div class="game-thumbnail">
    <img src="projects/[게임명]/assets/img/thumbnail.png" alt="...">
    <div class="game-overlay">
      <div class="game-badge" data-i18n="games.status.available">플레이 가능</div>
    </div>
  </div>
  <div class="game-info">
    <h3 class="game-title" data-i18n="games.[게임id].title">게임 제목</h3>
    <p class="game-genre" data-i18n="games.[게임id].genre">액션 RPG</p>
    <div class="game-platforms">
      <span class="platform-tag">PC</span>
      <span class="platform-tag">MOBILE</span>
    </div>
    <p class="game-description" data-i18n="games.[게임id].description">
      게임 설명...
    </p>
    <div class="game-actions">
      <a href="projects/[게임명]/index.html" class="btn btn-play" target="_blank">
        <span>🎮</span> <span data-i18n="games.playNow">지금 플레이</span>
      </a>
      <a href="projects/[게임명]/announcements.html" class="btn btn-info">
        <span>📢</span> <span data-i18n="games.news">소식</span>
      </a>
      <a href="https://github.com/eugene-doobu/eugene-doobu.github.io/issues?q=label%3A[게임명]" target="_blank" class="btn btn-support">
        <span>💬</span> <span data-i18n="games.support">문의</span>
      </a>
    </div>
  </div>
</div>
```

**게임 카드 배치 순서:**
1. 최신 게임 (맨 위)
2. 두 번째 최신 게임
3. 세 번째 최신 게임
4. ...
5. Coming Soon 카드 (맨 아래)

### 3. locales/*.json에 번역 추가
```json
{
  "games": {
    "[게임id]": {
      "title": "게임 제목",
      "genre": "장르",
      "description": "게임 설명...",
      "tags": ["태그1", "태그2"]
    }
  }
}
```

### 4. GitHub Issues 레이블 생성
- 레이블명: 게임명 (예: `3daudio`, `rpg`)
- 색상: 게임 테마에 맞게 설정
- 용도: 게임별 문의/버그 리포트 분류

---

## 🎯 핵심 차이점 요약

| 항목 | Before (포트폴리오) | After (스튜디오) |
|------|---------------------|------------------|
| **타이틀** | Eugene Doobu | 간식축내는 스튜디오 |
| **목적** | 개인 경력 | 게임 홍보 |
| **About** | 개인 소개 | 스튜디오 소개 |
| **Projects** | 기술 중심 | 게임 중심 |
| **공지사항** | 개발 일지 | 업데이트/이벤트 |
| **CTA** | "프로젝트 보기" | "지금 플레이" |
| **디자인** | 포트폴리오 스타일 | 크래프톤 스타일 |

---

## 🚦 향후 개선 사항

### 단기
- [ ] 플랫폼 필터 JavaScript 구현
- [ ] 게임별 공지사항 실제 컨텐츠 작성
- [ ] 스튜디오 로고 디자인 및 추가
- [ ] Open Graph 메타 태그 추가

### 중기
- [ ] 뉴스 RSS 피드 생성
- [ ] 게임 트레일러 동영상 임베드
- [ ] 플레이어 통계 표시 (플레이 횟수 등)
- [ ] 커뮤니티 Discord/Reddit 링크 추가

### 장기
- [ ] CMS 연동 (공지사항 관리)
- [ ] 다운로드 통계 트래킹
- [ ] 플레이어 리뷰 섹션
- [ ] 멀티 게임 런처 개발

---

## 📞 GitHub Issues 활용

### 용도
1. **게임별 문의**: 레이블로 분류 (`3daudio`, `rpg` 등)
2. **버그 리포트**: `bug` 레이블
3. **기능 제안**: `enhancement` 레이블
4. **일반 문의**: `question` 레이블

### 링크 형식
```
게임별: https://github.com/eugene-doobu/eugene-doobu.github.io/issues?q=label%3A[게임명]
전체: https://github.com/eugene-doobu/eugene-doobu.github.io/issues
```

---

## ✅ 체크리스트

### 새 게임 추가시
- [ ] 프로젝트 폴더 생성
- [ ] 썸네일 이미지 (1200x600px)
- [ ] index.html에 게임 카드 추가
- [ ] 3개 언어 모두 번역 추가 (ko/en/ja)
- [ ] GitHub Issues 레이블 생성
- [ ] 공지사항 페이지 작성
- [ ] 게임 실행 페이지 작성

### 공지사항 작성시
- [ ] 명확한 제목
- [ ] 날짜 및 카테고리 표시
- [ ] 업데이트 내용 상세 작성
- [ ] 이미지/스크린샷 추가 (선택)
- [ ] 관련 링크 제공
- [ ] 다국어 번역

---

## 🎨 디자인 원칙

1. **게임이 주인공**: 개발자가 아닌 게임을 홍보
2. **큰 비주얼**: 크래프톤처럼 게임 이미지를 크게
3. **명확한 정보**: 플랫폼, 장르, 상태를 명시
4. **쉬운 접근**: "지금 플레이" 버튼을 눈에 띄게
5. **커뮤니티**: 문의/피드백 채널 제공
6. **지속적 업데이트**: 뉴스 섹션에 최신 소식 유지

---

**© 2025 간식축내는 스튜디오. All rights reserved.**
