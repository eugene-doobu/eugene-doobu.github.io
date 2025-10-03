# Eugene Doobu Portfolio - Development Guide

이 문서는 eugene-doobu.github.io 포트폴리오 사이트의 디자인 시스템, 다국어 규칙, 개발 가이드를 포함합니다.

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [디자인 시스템](#디자인-시스템)
3. [다국어 지원 시스템](#다국어-지원-시스템)
4. [파일 구조](#파일-구조)
5. [개발 가이드](#개발-가이드)
6. [컴포넌트 가이드](#컴포넌트-가이드)

---

## 프로젝트 개요

**프로젝트명**: Eugene Doobu 게임 개발자 포트폴리오  
**타입**: GitHub Pages 정적 사이트  
**목적**: 게임 프로젝트 쇼케이스 및 커뮤니티 허브  
**기술 스택**: HTML5, CSS3, JavaScript (Vanilla), JSON

### 주요 기능

- ✨ 다크/라이트 테마 전환
- 🌍 다국어 지원 (한국어, 영어, 일본어)
- 🎮 게임 프로젝트 쇼케이스
- 📢 프로젝트별 공지사항 페이지
- 💬 GitHub Issues 기반 게시판
- 📱 완전 반응형 디자인

---

## 디자인 시스템

### 🎨 컬러 팔레트

#### 다크 테마 (기본)
```css
--bg-primary: #0a0e27;        /* 메인 배경 */
--bg-secondary: #151932;      /* 서브 배경 */
--bg-card: #1a1f3a;           /* 카드 배경 */
--text-primary: #e4e4e7;      /* 주요 텍스트 */
--text-secondary: #a1a1aa;    /* 부가 텍스트 */
--accent-primary: #667eea;    /* 주요 강조색 (보라) */
--accent-secondary: #764ba2;  /* 보조 강조색 (진보라) */
--accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

#### 라이트 테마
```css
--bg-primary: #f8f9fa;
--bg-secondary: #ffffff;
--bg-card: #ffffff;
--text-primary: #1a1a1a;
--text-secondary: #6b7280;
```

### 📏 스페이싱 시스템

```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 2rem;     /* 32px */
--spacing-lg: 4rem;     /* 64px */
--spacing-xl: 6rem;     /* 96px */
```

### 🔤 타이포그래피

**폰트 패밀리**:
- 영문: `Poppins` (300, 400, 600, 700)
- 한글: `Noto Sans KR` (300, 400, 700)

**폰트 크기 (반응형)**:
```css
/* 제목 */
.hero-title: clamp(2rem, 5vw, 4rem);
.section-title: clamp(2rem, 4vw, 3rem);

/* 본문 */
.hero-description: clamp(1rem, 2vw, 1.25rem);
body: 16px (base);
```

### 🎭 애니메이션

**Transitions**:
```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

**주요 애니메이션**:
- `fadeInUp`: 아래에서 위로 페이드인
- `bounce`: 위아래 바운스
- `bgFloat`: 배경 부유 효과

### 🖼️ 컴포넌트 디자인 규칙

#### 버튼
```css
.btn {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary: 그라데이션 배경
.btn-secondary: 투명 배경 + 테두리
.btn-play: 게임 플레이 버튼
.btn-issues: 게시판 버튼
.btn-info: 공지사항 버튼
```

#### 카드
```css
.project-card, .announcement-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
}

/* 호버 효과 */
:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px var(--shadow);
}
```

---

## 다국어 지원 시스템

### 🌍 지원 언어

- 🇰🇷 **한국어 (ko)**: 기본 언어
- 🇺🇸 **영어 (en)**
- 🇯🇵 **일본어 (ja)**

### 📁 번역 파일 구조

```
locales/
├── ko.json  # 한국어
├── en.json  # 영어
└── ja.json  # 일본어
```

### 📝 번역 데이터 구조

```json
{
  "nav": {
    "home": "Home",
    "projects": "Projects",
    "about": "About",
    "community": "Community"
  },
  "hero": {
    "greeting": "안녕하세요,",
    "name": "게임 개발자 <strong>Eugene Doobu</strong>입니다",
    "description": "창의적인 게임 경험을 만들어가는 개발자입니다.",
    "viewProjects": "프로젝트 보기",
    "github": "GitHub"
  },
  "projects": {
    "title": "게임 프로젝트",
    "game2048": {
      "title": "2048",
      "description": "Unity로 제작한 클래식 2048 퍼즐 게임",
      "tags": ["Unity", "WebGL", "Puzzle"]
    }
  }
}
```

### 🔧 HTML에서 번역 사용

```html
<!-- 기본 텍스트 번역 -->
<h1 data-i18n="hero.greeting">안녕하세요</h1>

<!-- HTML 태그 포함 번역 -->
<p data-i18n="hero.name" data-i18n-html>
  게임 개발자 <strong>Eugene Doobu</strong>입니다
</p>

<!-- 중첩된 요소 (span으로 감싸기) -->
<a href="#" class="btn">
  <span>🎮</span> <span data-i18n="projects.play">플레이하기</span>
</a>
```

### 💻 JavaScript에서 번역 사용

```javascript
// 번역 가져오기
const text = window.i18n.t('nav.home');

// 언어 변경
window.i18n.changeLanguage('en');

// 현재 언어 확인
const currentLang = window.i18n.getCurrentLanguage();

// 언어 변경 이벤트 리스닝
window.addEventListener('languageChanged', (e) => {
  console.log('Language changed to:', e.detail.language);
});
```

### 🎯 번역 키 네이밍 규칙

**규칙**: `섹션.컴포넌트.속성` 형식

```
nav.home              # 네비게이션 - 홈
hero.greeting         # 히어로 섹션 - 인사말
projects.game2048     # 프로젝트 - 2048 게임
about.description1    # 소개 - 첫 번째 설명
footer.rights         # 푸터 - 저작권
```

### ➕ 새 언어 추가 방법

1. **번역 파일 생성**: `locales/zh.json` (중국어 예시)

2. **i18n.js 수정**:
```javascript
this.supportedLanguages = ['ko', 'en', 'ja', 'zh'];
this.languageNames = {
    'ko': '한국어',
    'en': 'English',
    'ja': '日本語',
    'zh': '中文'
};
```

3. **HTML select에 옵션 추가**:
```html
<select id="language-selector">
  <option value="ko">한국어</option>
  <option value="en">English</option>
  <option value="ja">日本語</option>
  <option value="zh">中文</option>
</select>
```

### 🔄 언어 자동 감지

시스템은 다음 순서로 언어를 결정합니다:

1. **localStorage 저장값** (사용자가 선택한 언어)
2. **브라우저 언어** (`navigator.language`)
3. **기본값** (한국어)

```javascript
// 브라우저 언어 감지 예시
const browserLang = navigator.language; // "ko-KR", "en-US", etc.
const langCode = browserLang.split('-')[0]; // "ko", "en", etc.
```

---

## 파일 구조

```
eugene-doobu.github.io/
├── index.html              # 메인 페이지
├── styles.css              # 전역 스타일
├── script.js               # 메인 JavaScript
├── i18n.js                 # 다국어 시스템
├── CLAUDE.md              # 이 문서
│
├── locales/               # 다국어 번역 파일
│   ├── ko.json
│   ├── en.json
│   └── ja.json
│
└── projects/              # 프로젝트별 폴더
    ├── 2048/
    │   ├── index.html              # 게임 페이지
    │   ├── announcements.html      # 공지사항
    │   ├── announcement-style.css  # 공지사항 스타일
    │   └── Build/                  # Unity WebGL 빌드
    │
    ├── 3daudio/
    │   ├── index.html
    │   ├── announcements.html
    │   └── announcement-style.css
    │
    └── rpg/
        ├── announcements.html
        └── announcement-style.css
```

---

## 개발 가이드

### 🎮 새 게임 프로젝트 추가하기

#### 1. 프로젝트 폴더 생성

```
projects/
└── new-game/
    ├── index.html              # 게임 페이지
    ├── announcements.html      # 공지사항
    └── announcement-style.css  # 스타일
```

#### 2. 메인 index.html에 프로젝트 카드 추가

```html
<div class="project-card" data-project="new-game">
  <div class="project-image">
    <img src="projects/new-game/thumbnail.png" alt="New Game">
    <div class="project-overlay">
      <div class="project-info">
        <h3 class="project-title" data-i18n="projects.newGame.title">New Game</h3>
        <p class="project-description" data-i18n="projects.newGame.description">
          게임 설명
        </p>
        <div class="project-tags">
          <span class="tag">Unity</span>
          <span class="tag">WebGL</span>
        </div>
      </div>
    </div>
  </div>
  <div class="project-actions">
    <a href="projects/new-game/index.html" class="btn btn-play" target="_blank">
      <span>🎮</span> <span data-i18n="projects.play">플레이하기</span>
    </a>
    <a href="https://github.com/eugene-doobu/eugene-doobu.github.io/issues?q=label%3Anew-game" 
       target="_blank" class="btn btn-issues">
      <span>💬</span> <span data-i18n="projects.board">게시판</span>
    </a>
    <a href="projects/new-game/announcements.html" class="btn btn-info">
      <span>📢</span> <span data-i18n="projects.announcements">공지사항</span>
    </a>
  </div>
</div>
```

#### 3. 다국어 번역 추가

`locales/ko.json`, `en.json`, `ja.json`에 추가:

```json
{
  "projects": {
    "newGame": {
      "title": "새 게임",
      "description": "게임 설명",
      "tags": ["Unity", "WebGL"]
    }
  }
}
```

#### 4. GitHub Issues 라벨 생성

- 저장소 → Issues → Labels
- 이름: `new-game`
- 색상: 원하는 색 선택

#### 5. 공지사항 페이지 작성

`projects/new-game/announcements.html` 템플릿:

```html
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Game - 공지사항 | Eugene Doobu</title>
    <link rel="stylesheet" href="../../styles.css">
    <link rel="stylesheet" href="announcement-style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="../../index.html" class="logo">EUGENE DOOBU</a>
            <ul class="nav-menu">
                <li><a href="../../index.html" class="nav-link">Home</a></li>
                <li><a href="index.html" class="nav-link">게임 플레이</a></li>
                <li><a href="announcements.html" class="nav-link active">공지사항</a></li>
                <li><a href="https://github.com/eugene-doobu/eugene-doobu.github.io/issues?q=label%3Anew-game" target="_blank" class="nav-link">게시판</a></li>
            </ul>
        </div>
    </nav>

    <section class="page-header">
        <div class="header-content">
            <div class="game-icon">🎮</div>
            <h1 class="page-title">New Game</h1>
            <p class="page-subtitle">공지사항 및 업데이트</p>
        </div>
    </section>

    <section class="announcements-page">
        <div class="container">
            <!-- 공지사항 내용 -->
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Eugene Doobu. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
```

### 📝 공지사항 카드 컴포넌트

```html
<!-- 주요 공지 (Featured) -->
<div class="announcement-card featured">
    <div class="announcement-badge">최신 공지</div>
    <div class="announcement-header">
        <h2 class="announcement-title">🎉 제목</h2>
        <div class="announcement-meta">
            <span class="announcement-date">📅 2025.10.03</span>
            <span class="announcement-author">👤 Eugene Doobu</span>
        </div>
    </div>
    <div class="announcement-content">
        <p>내용...</p>
    </div>
</div>

<!-- 일반 공지 -->
<div class="announcement-card">
    <div class="announcement-header">
        <h2 class="announcement-title">제목</h2>
        <div class="announcement-meta">
            <span class="announcement-date">📅 2025.10.03</span>
        </div>
    </div>
    <div class="announcement-content">
        <p>내용...</p>
    </div>
</div>

<!-- 팁 카드 -->
<div class="announcement-card tips-card">
    <div class="announcement-header">
        <h2 class="announcement-title">💡 팁</h2>
    </div>
    <div class="announcement-content">
        <ul>
            <li>팁 1</li>
            <li>팁 2</li>
        </ul>
    </div>
</div>
```

### 🎨 커스텀 스타일 추가

프로젝트별로 다른 테마 색상을 적용하려면:

```css
/* announcement-style.css */
.page-header {
    background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

예시:
- 2048: `#667eea` → `#764ba2` (보라)
- 3D Audio: `#764ba2` → `#667eea` (역보라)
- RPG: `#f093fb` → `#f5576c` (핑크)

---

## 컴포넌트 가이드

### 🧭 네비게이션 바

```html
<nav class="navbar">
    <div class="nav-container">
        <a href="#home" class="logo">EUGENE DOOBU</a>
        <ul class="nav-menu">
            <li><a href="#home" class="nav-link" data-i18n="nav.home">Home</a></li>
        </ul>
        <div class="nav-actions">
            <select id="language-selector" class="language-selector">
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
            </select>
            <button class="theme-toggle" id="theme-toggle">
                <span class="sun-icon">☀️</span>
                <span class="moon-icon">🌙</span>
            </button>
        </div>
    </div>
</nav>
```

### 🎯 버튼 종류

```html
<!-- 주요 액션 버튼 -->
<a href="#" class="btn btn-primary">프로젝트 보기</a>

<!-- 보조 버튼 -->
<a href="#" class="btn btn-secondary">GitHub</a>

<!-- 게임 플레이 버튼 -->
<a href="#" class="btn btn-play">
    <span>🎮</span> 플레이하기
</a>

<!-- 게시판 버튼 -->
<a href="#" class="btn btn-issues">
    <span>💬</span> 게시판
</a>

<!-- 공지사항 버튼 -->
<a href="#" class="btn btn-info">
    <span>📢</span> 공지사항
</a>
```

### 📊 진행률 바 (RPG 프로젝트용)

```html
<div class="progress-section">
    <div class="progress-item">
        <span class="progress-label">캐릭터 시스템</span>
        <div class="progress-bar">
            <div class="progress-fill" style="width: 60%;">60%</div>
        </div>
    </div>
</div>
```

---

## 🚀 배포

### GitHub Pages 설정

1. 저장소 Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, Folder: / (root)
4. Save

### 커스텀 도메인 (선택사항)

1. 도메인 제공업체에서 CNAME 레코드 추가:
   ```
   CNAME @ username.github.io
   ```

2. 저장소에 `CNAME` 파일 추가:
   ```
   yourdomain.com
   ```

---

## 📌 개발 팁

### 디버깅

1. **다국어 시스템**: 콘솔에서 `window.i18n` 확인
2. **테마**: localStorage에서 `theme` 키 확인
3. **언어**: localStorage에서 `preferredLanguage` 키 확인

### 성능 최적화

1. **이미지**: WebP 포맷 사용 권장
2. **폰트**: 사용하는 weight만 로드
3. **애니메이션**: `will-change` 속성 사용 지양 (필요시만)

### 접근성

1. 모든 버튼에 `aria-label` 추가
2. 이미지에 `alt` 속성 추가
3. 색상 대비 4.5:1 이상 유지

---

## 🤝 기여 가이드

1. **이슈 생성**: 버그나 기능 제안
2. **풀 리퀘스트**: 변경사항 설명
3. **코드 스타일**: 기존 코드 스타일 따르기
4. **번역**: 모든 언어 파일에 추가

---

## 📞 연락처

- **GitHub**: [@eugene-doobu](https://github.com/eugene-doobu)
- **Issues**: [프로젝트 이슈](https://github.com/eugene-doobu/eugene-doobu.github.io/issues)

---

## 📄 라이선스

© 2025 Eugene Doobu. All rights reserved.

---

**마지막 업데이트**: 2025.10.03
