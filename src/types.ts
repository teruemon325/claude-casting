export const CATEGORIES = [
  '砂型',
  '中子',
  '金型（重力・低圧）',
  'ダイカスト金型',
  '方案設計',
  '鋳造欠陥',
  '塗型・離型剤',
  '型の保守・寿命',
  '安全',
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

/** ノウハウ1件分のデータ */
export interface KnowHow {
  id: string;
  title: string;
  category: Category;
  tags: string[];
  /** 一覧に表示する要約 */
  summary: string;
  /** 現象・課題 */
  problem: string;
  /** 原因 */
  cause: string;
  /** 対策・ノウハウ */
  solution: string;
  /** 備考（参考値・注意点など） */
  notes: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

/** フォームから受け取る入力値 */
export type KnowHowInput = Pick<
  KnowHow,
  'title' | 'category' | 'tags' | 'summary' | 'problem' | 'cause' | 'solution' | 'notes'
>;

export const EMPTY_INPUT: KnowHowInput = {
  title: '',
  category: CATEGORIES[0],
  tags: [],
  summary: '',
  problem: '',
  cause: '',
  solution: '',
  notes: '',
};
