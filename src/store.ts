import { isCategory, type KnowHow, type KnowHowInput } from './types';

export const STORAGE_KEY = 'casting-mold-knowhow:v1';

/** localStorage 互換の最小インターフェース（テストで差し替えられるようにする） */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `kh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeTags(tags: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of tags) {
    const tag = raw.trim();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  return result;
}

/** 文字列を受け取って「,」「、」「空白」でタグに分割する */
export function parseTagText(text: string): string[] {
  return normalizeTags(text.split(/[,、\s]+/));
}

function sanitizeInput(input: KnowHowInput): KnowHowInput {
  return {
    title: input.title.trim(),
    category: input.category,
    tags: normalizeTags(input.tags),
    summary: input.summary.trim(),
    problem: input.problem.trim(),
    cause: input.cause.trim(),
    solution: input.solution.trim(),
    notes: input.notes.trim(),
  };
}

export function validateInput(input: KnowHowInput): string[] {
  const errors: string[] = [];
  if (!input.title.trim()) errors.push('タイトルを入力してください。');
  if (!isCategory(input.category)) errors.push('カテゴリを選択してください。');
  if (!input.solution.trim()) errors.push('対策・ノウハウを入力してください。');
  return errors;
}

export function createEntry(input: KnowHowInput, now: Date = new Date()): KnowHow {
  const iso = now.toISOString();
  return {
    id: generateId(),
    ...sanitizeInput(input),
    favorite: false,
    createdAt: iso,
    updatedAt: iso,
  };
}

export function updateEntry(
  entries: readonly KnowHow[],
  id: string,
  input: KnowHowInput,
  now: Date = new Date(),
): KnowHow[] {
  return entries.map((entry) =>
    entry.id === id ? { ...entry, ...sanitizeInput(input), updatedAt: now.toISOString() } : entry,
  );
}

export function deleteEntry(entries: readonly KnowHow[], id: string): KnowHow[] {
  return entries.filter((entry) => entry.id !== id);
}

export function toggleFavorite(entries: readonly KnowHow[], id: string): KnowHow[] {
  return entries.map((entry) => (entry.id === id ? { ...entry, favorite: !entry.favorite } : entry));
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

/** 外部から来た JSON を KnowHow に正規化する。必須項目が欠けていれば null */
export function coerceEntry(raw: unknown): KnowHow | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const title = asString(obj.title).trim();
  if (!title || !isCategory(obj.category)) return null;
  const tags = Array.isArray(obj.tags) ? obj.tags.filter((t): t is string => typeof t === 'string') : [];
  const now = new Date().toISOString();
  return {
    id: asString(obj.id) || generateId(),
    title,
    category: obj.category,
    tags: normalizeTags(tags),
    summary: asString(obj.summary),
    problem: asString(obj.problem),
    cause: asString(obj.cause),
    solution: asString(obj.solution),
    notes: asString(obj.notes),
    favorite: obj.favorite === true,
    createdAt: asString(obj.createdAt, now),
    updatedAt: asString(obj.updatedAt, now),
  };
}

export function loadEntries(storage: StorageLike, seed: readonly KnowHow[]): KnowHow[] {
  let text: string | null = null;
  try {
    text = storage.getItem(STORAGE_KEY);
  } catch {
    return [...seed];
  }
  if (!text) return [...seed];
  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) return [...seed];
    return parsed.map(coerceEntry).filter((e): e is KnowHow => e !== null);
  } catch {
    return [...seed];
  }
}

export function saveEntries(storage: StorageLike, entries: readonly KnowHow[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // 容量超過やプライベートモードでは保存できないことがあるが、アプリの動作は継続させる
  }
}

export function exportJson(entries: readonly KnowHow[]): string {
  return JSON.stringify({ app: 'casting-mold-knowhow', version: 1, entries }, null, 2);
}

/** エクスポート形式または KnowHow の配列を読み込む。壊れていれば例外 */
export function importJson(text: string): KnowHow[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('JSON として読み込めませんでした。');
  }
  const list = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { entries?: unknown }).entries)
      ? ((parsed as { entries: unknown[] }).entries)
      : null;
  if (!list) throw new Error('ノウハウの配列が見つかりませんでした。');
  const entries = list.map(coerceEntry).filter((e): e is KnowHow => e !== null);
  if (entries.length === 0) throw new Error('有効なノウハウが1件もありませんでした。');
  return entries;
}

/** インポートしたデータを既存データに統合する。同じ id は上書き、新規は末尾に追加 */
export function mergeEntries(existing: readonly KnowHow[], incoming: readonly KnowHow[]): KnowHow[] {
  const byId = new Map(existing.map((e) => [e.id, e] as const));
  for (const entry of incoming) byId.set(entry.id, entry);
  return [...byId.values()];
}
