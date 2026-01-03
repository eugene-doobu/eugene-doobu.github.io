#!/usr/bin/env python3
"""
Velog 블로그 이미지 다운로드 스크립트

사용법:
    python scripts/download_velog_images.py <mdx_file_path>

예시:
    python scripts/download_velog_images.py src/content/blog/my-post/index.mdx

기능:
    1. MDX 파일에서 velog.velcdn.com 이미지 URL 추출
    2. 이미지를 public/blog/<post-name>/ 폴더에 다운로드
    3. MDX 파일의 이미지 경로를 로컬 경로로 자동 치환
"""

import io
import os
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urlparse, unquote

# Windows 콘솔 UTF-8 출력 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


def extract_velog_images(content: str) -> list[tuple[str, str]]:
    """MDX 콘텐츠에서 velog 이미지 URL 추출

    Returns:
        list of (full_match, url) tuples
    """
    patterns = [
        # Markdown 이미지: ![alt](url)
        r'(!\[[^\]]*\]\((https?://velog\.velcdn\.com/[^)]+)\))',
        # HTML img 태그: <img src="url" />
        r'(<img[^>]+src=["\'](https?://velog\.velcdn\.com/[^"\']+)["\'][^>]*>)',
        # 단순 URL (줄 단위)
        r'(^(https?://velog\.velcdn\.com/[^\s]+)$)',
    ]

    matches = []
    for pattern in patterns:
        for match in re.finditer(pattern, content, re.MULTILINE):
            full_match = match.group(1)
            url = match.group(2)
            if (full_match, url) not in matches:
                matches.append((full_match, url))

    return matches


def get_filename_from_url(url: str, index: int) -> str:
    """URL에서 파일명 추출, 없으면 인덱스 기반 생성"""
    parsed = urlparse(url)
    path = unquote(parsed.path)

    # URL에서 파일명 추출
    filename = os.path.basename(path)

    # 파일명이 없거나 확장자가 없는 경우
    if not filename or '.' not in filename:
        # Content-Type 기반으로 확장자 결정 (기본값 png)
        ext = '.png'
        if 'gif' in url.lower():
            ext = '.gif'
        elif 'jpg' in url.lower() or 'jpeg' in url.lower():
            ext = '.jpg'
        elif 'webp' in url.lower():
            ext = '.webp'
        filename = f"{index:02d}-image{ext}"
    else:
        # 파일명 정리 (특수문자 제거)
        name, ext = os.path.splitext(filename)
        name = re.sub(r'[^\w\-]', '-', name)
        name = re.sub(r'-+', '-', name).strip('-')
        if not name:
            name = f"{index:02d}-image"
        else:
            name = f"{index:02d}-{name}"
        filename = f"{name}{ext}"

    return filename


def download_image(url: str, dest_path: Path) -> bool:
    """이미지 다운로드"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)

        with urllib.request.urlopen(req, timeout=30) as response:
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            with open(dest_path, 'wb') as f:
                f.write(response.read())

        print(f"  ✓ 다운로드: {dest_path.name}")
        return True
    except Exception as e:
        print(f"  ✗ 실패: {url} - {e}")
        return False


def process_mdx_file(mdx_path: str) -> None:
    """MDX 파일 처리"""
    mdx_path = Path(mdx_path).resolve()

    if not mdx_path.exists():
        print(f"오류: 파일을 찾을 수 없습니다 - {mdx_path}")
        sys.exit(1)

    if not mdx_path.suffix == '.mdx':
        print(f"오류: MDX 파일이 아닙니다 - {mdx_path}")
        sys.exit(1)

    # 포스트 이름 추출 (폴더명)
    post_name = mdx_path.parent.name

    # 프로젝트 루트 찾기
    project_root = mdx_path
    while project_root.parent != project_root:
        if (project_root / 'package.json').exists():
            break
        project_root = project_root.parent

    # 이미지 저장 경로
    images_dir = project_root / 'public' / 'blog' / post_name

    print(f"\n📁 MDX 파일: {mdx_path}")
    print(f"📂 이미지 저장 경로: {images_dir}\n")

    # MDX 파일 읽기
    content = mdx_path.read_text(encoding='utf-8')

    # Velog 이미지 추출
    matches = extract_velog_images(content)

    if not matches:
        print("ℹ️  Velog 이미지를 찾을 수 없습니다.")
        return

    print(f"🔍 {len(matches)}개의 Velog 이미지 발견\n")

    # 이미지 다운로드 및 경로 치환
    replacements = {}
    for index, (full_match, url) in enumerate(matches, 1):
        filename = get_filename_from_url(url, index)
        local_path = images_dir / filename
        web_path = f"/blog/{post_name}/{filename}"

        if download_image(url, local_path):
            # 원본 매치에서 URL만 치환
            new_match = full_match.replace(url, web_path)
            replacements[full_match] = new_match

    # MDX 파일 업데이트
    if replacements:
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)

        mdx_path.write_text(new_content, encoding='utf-8')
        print(f"\n✅ MDX 파일 업데이트 완료: {len(replacements)}개 이미지 경로 치환")
    else:
        print("\n⚠️  다운로드된 이미지가 없습니다.")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    mdx_path = sys.argv[1]
    process_mdx_file(mdx_path)


if __name__ == '__main__':
    main()
