import type { Category } from '../types';

const COLOR_INDEX: Record<Category, number> = {
  砂型: 0,
  中子: 1,
  '金型（重力・低圧）': 2,
  ダイカスト金型: 3,
  方案設計: 4,
  鋳造欠陥: 5,
  '塗型・離型剤': 6,
  '型の保守・寿命': 7,
  安全: 8,
};

export function CategoryBadge({ category }: { category: Category }) {
  return <span className={`badge badge-c${COLOR_INDEX[category]}`}>{category}</span>;
}
