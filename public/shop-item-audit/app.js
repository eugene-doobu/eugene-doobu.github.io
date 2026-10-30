'use strict';

const STATUS = {
  suspect: { label: '미연결 후보', order: 0 },
  connected: { label: '연결 확인', order: 2 },
  ownership: { label: '보유·배치·수집형', order: 3 },
  review: { label: '추가 검토', order: 1 },
};
const nf = new Intl.NumberFormat('ko-KR');
const byId = (id) => document.getElementById(id);
let catalog = [];

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined && value !== null) node.textContent = text(value);
  return node;
}

function text(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function values(value) {
  if (Array.isArray(value)) return value.filter((v) => v !== null && v !== undefined && v !== '');
  return value === null || value === undefined || value === '' ? [] : [value];
}

function count(value) {
  return typeof value === 'number' && Number.isFinite(value) ? nf.format(value) : '—';
}

function statusKey(value) {
  return Object.hasOwn(STATUS, value) ? value : 'review';
}

function sourceAnchor(value) {
  return `source-${text(value).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function appendList(parent, entries, className) {
  const list = element('ul', className);
  for (const entry of entries) list.append(element('li', '', entry));
  parent.append(list);
}

function badge(key, label) {
  const normalized = statusKey(key);
  return element('span', `badge badge-${normalized}`, label || STATUS[normalized].label);
}

function renderMeta(meta, summary) {
  if (meta.title) {
    byId('report-title').textContent = meta.title;
    document.title = `${meta.title} | ITEM AUDIT`;
  }
  if (meta.scope) byId('report-scope').textContent = meta.scope;
  byId('report-date').textContent = meta.date || '기준일 미기재';
  byId('snapshot-commit').textContent = meta.commit || '미기재';
  byId('snapshot-version').textContent = meta.version || '미기재';
  byId('snapshot-hash').textContent = meta.hash || '미기재';
  const metrics = [
    { label: '검사한 아이템 정의', value: summary.itemDefinitions, note: 'ItemBase 전체 정의' },
    { label: '지급처 확인 아이템', value: summary.suppliedItems, note: '지급·보상 연결 대조' },
    { label: '사용처 미연결 후보', value: summary.suspectItems, note: '현재 스냅샷의 추가 확인 대상', alert: true },
    { label: '디코딩한 데이터 테이블', value: summary.tables, note: `${count(summary.tableRows)}행 · ${count(summary.productRefs)}개 제품 참조` },
  ];
  byId('metrics').replaceChildren(...metrics.map((metric) => {
    const card = element('div', `metric${metric.alert ? ' metric-alert' : ''}`);
    card.append(element('span', '', metric.label), element('strong', '', count(metric.value)), element('small', '', metric.note));
    return card;
  }));
  byId('metrics').setAttribute('aria-busy', 'false');
  byId('caveats-list').replaceChildren(...values(meta.caveats).map((caveat) => element('li', '', caveat)));
}

function renderChart(rows) {
  const totals = { suspect: 0, connected: 0, ownership: 0, review: 0 };
  for (const row of rows) totals[statusKey(row.status)] += 1;
  const fragment = document.createDocumentFragment();
  for (const key of ['connected', 'ownership', 'suspect', 'review']) {
    const row = element('div', 'chart-row');
    row.dataset.status = key;
    const track = element('div', 'chart-track');
    track.setAttribute('aria-hidden', 'true');
    const fill = element('div', 'chart-fill');
    fill.style.width = `${rows.length ? totals[key] / rows.length * 100 : 0}%`;
    track.append(fill);
    row.append(element('span', 'chart-label', STATUS[key].label), track, element('span', 'chart-count', count(totals[key])));
    fragment.append(row);
  }
  fragment.append(element('p', 'chart-total', `전체 목록 ${count(rows.length)}개 기준 · 검색 필터 적용 전`));
  byId('status-chart').replaceChildren(fragment);
}

function renderFindings(findings) {
  const safeFindings = values(findings);
  byId('finding-count').textContent = `${count(safeFindings.length)}건`;
  if (!safeFindings.length) {
    byId('findings-list').replaceChildren(element('div', 'panel muted', '이 보고서에 등록된 발견 사항이 없습니다.'));
    return;
  }
  byId('findings-list').replaceChildren(...safeFindings.map((finding, index) => {
    const card = element('article', 'finding-card');
    const top = element('div', 'finding-top');
    top.append(element('span', 'finding-id', finding.id || `FINDING ${index + 1}`), badge('suspect', finding.status || finding.severity || '검토 대상'));
    const content = element('div', 'finding-content');
    content.append(element('h3', '', finding.title), element('p', 'finding-detail', finding.detail));
    const evidence = values(finding.evidence);
    if (evidence.length) appendList(content, evidence, 'finding-evidence');
    if (finding.recommendation) {
      const action = element('p', 'finding-action');
      action.append(element('strong', '', '확인 제안'), document.createTextNode(text(finding.recommendation)));
      content.append(action);
    }
    card.append(top, content);
    return card;
  }));
}

function renderRows() {
  const query = byId('search').value.trim().toLocaleLowerCase('ko-KR');
  const status = byId('status-filter').value;
  const shop = byId('shop-filter').value;
  const filtered = catalog.filter((row) => (!status || statusKey(row.status) === status)
    && (!shop || text(row.shop) === shop)
    && (!query || row._search.includes(query)));
  byId('result-count').textContent = `전체 ${count(catalog.length)}개 중 ${count(filtered.length)}개 표시`;
  if (!filtered.length) {
    const row = element('tr');
    const cell = element('td', 'empty-state', '일치하는 아이템이 없습니다. 검색어나 필터를 바꿔 보세요.');
    cell.colSpan = 5;
    row.append(cell);
    byId('catalog-body').replaceChildren(row);
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const item of filtered) {
    const row = element('tr');
    row.dataset.status = statusKey(item.status);
    const identity = element('td');
    identity.append(element('div', 'item-name', item.name || '이름 미정의'), element('span', 'item-sub', `${item.category || 'Item'} · ID ${text(item.itemId)}`));
    if (item.itemType) identity.append(element('span', 'item-type', item.itemType));
    const verdict = element('td');
    verdict.append(badge(item.status, item.statusLabel));
    const source = element('td');
    source.append(element('span', 'cell-title', item.shop || '분류 미기재'));
    const supplySources = values(item.supplySources);
    if (supplySources.length) {
      source.append(element('span', 'cell-code', `${count(item.supplyReferences)}개 지급 참조 · ${count(supplySources.length)}개 테이블`));
      const formatSupply = (supply) => `${text(supply.table)} · ${count(supply.references)}개 참조 · 행 ${values(supply.rowIds).map(text).join(', ')}${supply.references > values(supply.rowIds).length ? ' 외' : ''}`;
      appendList(source, supplySources.slice(0, 3).map(formatSupply), 'cell-list supply-preview');
      if (supplySources.length > 3) {
        const detail = element('details', 'supply-details');
        detail.append(element('summary', '', `나머지 ${count(supplySources.length - 3)}개 테이블 펼치기`));
        appendList(detail, supplySources.slice(3).map(formatSupply), 'cell-list');
        source.append(detail);
      }
    } else {
      source.append(element('span', 'cell-code', item.table || '경로 미기재'));
    }
    const usage = element('td');
    const paths = values(item.usage);
    if (paths.length) {
      if (typeof item.usageReferenceCount === 'number') usage.append(element('span', 'cell-code usage-count', `전체 ${count(item.usageReferenceCount)}개 연결 중 ${count(paths.length)}개 표시`));
      appendList(usage, paths, 'cell-list');
    }
    else usage.append(element('span', 'muted', '등록된 경로 없음'));
    const notes = element('td', 'note-cell');
    const noteValues = values(item.notes);
    if (noteValues.length) appendList(notes, noteValues, 'cell-list');
    const cost = text(item.cost);
    if (cost && !/상점(?: 구매)? 외 지급/.test(cost)) {
      const price = element('p', 'cost-note');
      price.append(element('strong', '', '상점 비용'), document.createTextNode(` ${cost}`));
      notes.append(price);
    } else if (!noteValues.length) notes.append(document.createTextNode('—'));
    row.append(identity, verdict, source, usage, notes);
    fragment.append(row);
  }
  byId('catalog-body').replaceChildren(fragment);
}

function renderSources(sources) {
  byId('sources-list').replaceChildren(...values(sources).map((source, index) => {
    const entry = element('li', 'source-entry');
    const id = source.id || `S${index + 1}`;
    entry.id = sourceAnchor(id);
    const anchor = element('a', 'source-label', id);
    anchor.href = `#${entry.id}`;
    const path = text(source.path || source.url || '경로 미기재');
    const anchorText = source.anchor ? ` · ${text(source.anchor)}` : '';
    const link = /^https?:\/\//i.test(path) ? element('a', 'source-path', path + anchorText) : element('span', 'source-path', path + anchorText);
    if (link instanceof HTMLAnchorElement) {
      link.href = path;
      link.rel = 'noopener noreferrer';
      link.target = '_blank';
    }
    entry.append(anchor, link, element('span', 'source-description', source.description));
    return entry;
  }));
}

function renderMethod(data) {
  byId('method-list').replaceChildren(...values(data.methodology).map((method) => element('li', '', method)));
  byId('checks-list').replaceChildren(...values(data.checks).map((check) => {
    const entry = element('li', `check${check.passed ? '' : ' failed'}`);
    const mark = element('span', 'check-mark', check.passed ? '✓' : '!');
    mark.setAttribute('aria-label', check.passed ? '통과' : '미통과 또는 확인 필요');
    const details = element('div');
    details.append(element('span', 'check-name', check.name), element('span', 'check-detail', check.detail));
    entry.append(mark, details);
    return entry;
  }));
  renderSources(data.sources);
}

async function init() {
  try {
    const response = await fetch('./data.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.rows) || !data.meta || !data.summary) throw new Error('필수 데이터 형식 누락');
    catalog = data.rows.map((row) => ({ ...row, _search: [row.name, row.itemId, row.rowId, row.table, row.shop, row.category, row.itemType, row.supplySources, ...values(row.usage), ...values(row.notes)].map(text).join(' ').toLocaleLowerCase('ko-KR') }));
    catalog.sort((a, b) => STATUS[statusKey(a.status)].order - STATUS[statusKey(b.status)].order || Number(a.itemId) - Number(b.itemId) || text(a.rowId).localeCompare(text(b.rowId)));
    const shops = [...new Set(catalog.map((row) => text(row.shop)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko'));
    for (const shop of shops) {
      const option = element('option', '', shop);
      option.value = shop;
      byId('shop-filter').append(option);
    }
    renderMeta(data.meta, data.summary);
    renderChart(catalog);
    renderFindings(data.findings);
    renderMethod(data);
    renderRows();
    byId('filter-form').addEventListener('submit', (event) => event.preventDefault());
    byId('search').addEventListener('input', renderRows);
    byId('status-filter').addEventListener('change', renderRows);
    byId('shop-filter').addEventListener('change', renderRows);
    byId('reset-filters').addEventListener('click', () => {
      byId('filter-form').reset();
      renderRows();
      byId('search').focus();
    });
  } catch (error) {
    const box = byId('load-error');
    box.hidden = false;
    box.textContent = `보고서 데이터를 불러오지 못했습니다 (${error.message}). 페이지를 새로고침하거나 CSV·검증 요약을 확인해 주세요.`;
    byId('report-date').textContent = '데이터 로드 실패';
    byId('metrics').setAttribute('aria-busy', 'false');
    byId('result-count').textContent = '목록을 불러오지 못했습니다.';
    const row = element('tr');
    const cell = element('td', 'empty-state', '데이터 로드 실패. 페이지 위쪽 오류 메시지를 확인해 주세요.');
    cell.colSpan = 5;
    row.append(cell);
    byId('catalog-body').replaceChildren(row);
  }
}

init();
