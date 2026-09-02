import { describe, expect, it } from 'vitest';
import { DEFAULT_FILTER, collectTags, countByCategory, filterEntries, normalizeText } from '../search';
import { createEntry } from '../store';
import { EMPTY_INPUT, type KnowHow } from '../types';

function make(overrides: Partial<KnowHow>, updatedAt = '2026-01-01T00:00:00.000Z'): KnowHow {
  return {
    ...createEntry({ ...EMPTY_INPUT, title: 't', solution: 's' }),
    updatedAt,
    ...overrides,
  };
}

const entries: KnowHow[] = [
  make({ id: '1', title: '押湯の配置', category: '方案設計', tags: ['押湯', '引け巣'], solution: 'モジュラス' }, '2026-01-03T00:00:00Z'),
  make({ id: '2', title: 'ダイカストの焼付き', category: 'ダイカスト金型', tags: ['焼付き', '離型剤'], favorite: true }, '2026-01-02T00:00:00Z'),
  make({ id: '3', title: '砂の水分', category: '砂型', tags: ['砂', '引け巣'], notes: 'ＣＢ 35〜45%' }, '2026-01-01T00:00:00Z'),
];

describe('normalizeText', () => {
  it('folds full-width and case', () => {
    expect(normalizeText('ＣＢ ABC')).toBe('cb abc');
  });
});

describe('filterEntries', () => {
  it('returns everything sorted by updatedAt desc with default filter', () => {
    expect(filterEntries(entries, DEFAULT_FILTER).map((e) => e.id)).toEqual(['1', '2', '3']);
  });

  it('filters by category', () => {
    expect(filterEntries(entries, { ...DEFAULT_FILTER, category: '砂型' }).map((e) => e.id)).toEqual(['3']);
  });

  it('filters by favorites', () => {
    expect(filterEntries(entries, { ...DEFAULT_FILTER, favoritesOnly: true }).map((e) => e.id)).toEqual(['2']);
  });

  it('requires all selected tags', () => {
    expect(filterEntries(entries, { ...DEFAULT_FILTER, tags: ['引け巣'] }).map((e) => e.id)).toEqual(['1', '3']);
    expect(filterEntries(entries, { ...DEFAULT_FILTER, tags: ['引け巣', '砂'] }).map((e) => e.id)).toEqual(['3']);
  });

  it('matches every query token across all text fields, ignoring width', () => {
    expect(filterEntries(entries, { ...DEFAULT_FILTER, query: 'cb 45' }).map((e) => e.id)).toEqual(['3']);
    expect(filterEntries(entries, { ...DEFAULT_FILTER, query: '押湯 モジュラス' }).map((e) => e.id)).toEqual(['1']);
    expect(filterEntries(entries, { ...DEFAULT_FILTER, query: '押湯 砂' })).toEqual([]);
  });

  it('combines filters', () => {
    const result = filterEntries(entries, { ...DEFAULT_FILTER, query: '引け', category: '方案設計' });
    expect(result.map((e) => e.id)).toEqual(['1']);
  });
});

describe('collectTags / countByCategory', () => {
  it('counts tags sorted by frequency', () => {
    const tags = collectTags(entries);
    expect(tags[0]).toEqual({ tag: '引け巣', count: 2 });
    expect(tags).toHaveLength(5);
  });

  it('counts categories', () => {
    const counts = countByCategory(entries);
    expect(counts.get('砂型')).toBe(1);
    expect(counts.get('安全')).toBeUndefined();
  });
});
