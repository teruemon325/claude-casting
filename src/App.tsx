import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SEED_ENTRIES } from './data/seed';
import { DEFAULT_FILTER, filterEntries, type Filter } from './search';
import {
  createEntry,
  deleteEntry,
  exportJson,
  importJson,
  loadEntries,
  mergeEntries,
  saveEntries,
  toggleFavorite,
  updateEntry,
} from './store';
import { EMPTY_INPUT, type KnowHow, type KnowHowInput } from './types';
import { EntryDetail } from './components/EntryDetail';
import { EntryForm } from './components/EntryForm';
import { EntryList } from './components/EntryList';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

type FormState = { mode: 'new' } | { mode: 'edit'; id: string } | null;

function pickInput(entry: KnowHow): KnowHowInput {
  const { title, category, tags, summary, problem, cause, solution, notes } = entry;
  return { title, category, tags, summary, problem, cause, solution, notes };
}

export default function App() {
  const [entries, setEntries] = useState<KnowHow[]>(() => loadEntries(window.localStorage, SEED_ENTRIES));
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveEntries(window.localStorage, entries);
  }, [entries]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visible = useMemo(() => filterEntries(entries, filter), [entries, filter]);
  const selected = selectedId ? entries.find((e) => e.id === selectedId) ?? null : null;

  const closeDetail = useCallback(() => setSelectedId(null), []);
  const closeForm = useCallback(() => setForm(null), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleSubmit = (input: KnowHowInput) => {
    if (form?.mode === 'edit') {
      setEntries((prev) => updateEntry(prev, form.id, input));
      setToast('ノウハウを更新しました。');
    } else {
      const entry = createEntry(input);
      setEntries((prev) => [entry, ...prev]);
      setToast('ノウハウを追加しました。');
    }
    setForm(null);
  };

  const handleDelete = (id: string) => {
    const target = entries.find((e) => e.id === id);
    if (!target) return;
    if (!window.confirm(`「${target.title}」を削除しますか？`)) return;
    setEntries((prev) => deleteEntry(prev, id));
    setSelectedId(null);
    setToast('ノウハウを削除しました。');
  };

  const handleExport = () => {
    const blob = new Blob([exportJson(entries)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `casting-mold-knowhow-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const imported = importJson(await file.text());
      setEntries((prev) => mergeEntries(prev, imported));
      setToast(`${imported.length} 件を取り込みました。`);
    } catch (err) {
      setToast(`インポートに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleReset = () => {
    if (!window.confirm('登録したノウハウをすべて消して初期データに戻します。よろしいですか？')) return;
    setEntries([...SEED_ENTRIES]);
    setFilter(DEFAULT_FILTER);
    setSelectedId(null);
    setToast('初期データに戻しました。');
  };

  const addTagFilter = (tag: string) => {
    setFilter((prev) => (prev.tags.includes(tag) ? prev : { ...prev, tags: [...prev.tags, tag] }));
  };

  return (
    <div className="app">
      <Header
        query={filter.query}
        onQueryChange={(query) => setFilter((prev) => ({ ...prev, query }))}
        onNew={() => setForm({ mode: 'new' })}
        onExport={handleExport}
        onImport={() => fileInputRef.current?.click()}
        onReset={handleReset}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          void handleImportFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <div className="layout">
        {sidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} />}
        <Sidebar entries={entries} filter={filter} onChange={setFilter} open={sidebarOpen} onClose={closeSidebar} />
        <EntryList
          entries={visible}
          total={entries.length}
          onSelect={setSelectedId}
          onToggleFavorite={(id) => setEntries((prev) => toggleFavorite(prev, id))}
          onTagClick={addTagFilter}
        />
      </div>

      {selected && !form && (
        <EntryDetail
          entry={selected}
          onClose={closeDetail}
          onEdit={() => setForm({ mode: 'edit', id: selected.id })}
          onDelete={() => handleDelete(selected.id)}
          onToggleFavorite={() => setEntries((prev) => toggleFavorite(prev, selected.id))}
        />
      )}

      {form && (
        <EntryForm
          key={form.mode === 'edit' ? form.id : 'new'}
          title={form.mode === 'edit' ? 'ノウハウを編集' : 'ノウハウを追加'}
          initial={form.mode === 'edit' ? pickInput(entries.find((e) => e.id === form.id)!) : EMPTY_INPUT}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
