'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Loader2, NotebookPen, Plus, Save, Search, Trash2 } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from '@/lib/supabase/actions';
import { formatDate } from '@/lib/utils/formatters';
import { NoteRecord } from '@/types';

const EMPTY_TITLE = 'Untitled note';

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedId) ?? null,
    [notes, selectedId]
  );

  const hasChanges = Boolean(
    selectedNote &&
      (selectedNote.title !== title.trim() || selectedNote.content !== content)
  );

  const loadNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getNotes(search);
      setNotes(data);

      if (data.length === 0) {
        setSelectedId(null);
        setTitle('');
        setContent('');
        return;
      }

      const nextSelected = selectedId && data.some((note) => note.id === selectedId)
        ? selectedId
        : data[0].id;
      const note = data.find((item) => item.id === nextSelected) ?? data[0];
      setSelectedId(note.id);
      setTitle(note.title);
      setContent(note.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const selectNote = (note: NoteRecord) => {
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setError('');
  };

  const handleCreate = async () => {
    setSaving(true);
    setError('');
    try {
      const note = await createNote(EMPTY_TITLE, '');
      setNotes((current) => [note, ...current]);
      selectNote(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selectedNote) return;

    const nextTitle = title.trim() || EMPTY_TITLE;
    setSaving(true);
    setError('');
    try {
      const saved = await updateNote(selectedNote.id, nextTitle, content);
      setNotes((current) =>
        current
          .map((note) => (note.id === saved.id ? saved : note))
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );
      setTitle(saved.title);
      setContent(saved.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) return;

    setDeleting(true);
    setError('');
    try {
      await deleteNote(selectedNote.id);
      const remaining = notes.filter((note) => note.id !== selectedNote.id);
      setNotes(remaining);
      const next = remaining[0] ?? null;
      setSelectedId(next?.id ?? null);
      setTitle(next?.title ?? '');
      setContent(next?.content ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <TopNav
        title="Notes"
        subtitle={`${notes.length} note${notes.length !== 1 ? 's' : ''}`}
      />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 min-h-[calc(100vh-120px)]">
          <aside className="glass-card rounded-2xl border border-white/8 overflow-hidden flex flex-col min-h-[360px]">
            <div className="p-4 border-b border-white/8 space-y-3">
              <button
                onClick={handleCreate}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-violet-500/20 transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                New Note
              </button>

              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search notes"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-500/50 focus:bg-white/8 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loading && (
                <div className="h-48 flex items-center justify-center text-white/35">
                  <Loader2 size={20} className="animate-spin" />
                </div>
              )}

              {!loading && notes.length === 0 && (
                <div className="h-56 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <NotebookPen size={20} className="text-white/35" />
                  </div>
                  <p className="text-sm font-medium text-white/65">No notes yet</p>
                  <p className="text-xs text-white/30 mt-1">Create one to start writing.</p>
                </div>
              )}

              {!loading && notes.map((note) => {
                const active = note.id === selectedId;
                const snippet = note.content.trim() || 'No content';

                return (
                  <button
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`w-full text-left p-3 rounded-xl transition-colors mb-1.5 ${
                      active
                        ? 'bg-violet-500/15 border border-violet-500/30'
                        : 'border border-transparent hover:bg-white/6'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        active ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-white/35'
                      }`}>
                        <Edit3 size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{note.title}</p>
                        <p className="text-xs text-white/35 truncate mt-0.5">{snippet}</p>
                        <p className="text-[11px] text-white/25 mt-2">{formatDate(note.updated_at)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="glass-card rounded-2xl border border-white/8 overflow-hidden flex flex-col min-h-[520px]">
            {selectedNote ? (
              <>
                <div className="p-5 border-b border-white/8 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Note title"
                    className="flex-1 min-w-0 bg-transparent text-xl font-semibold text-white placeholder:text-white/25 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    {hasChanges && <span className="text-xs text-amber-300/80 px-2">Unsaved</span>}
                    <button
                      onClick={handleSave}
                      disabled={saving || !hasChanges}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/8 border border-white/10 text-sm text-white/75 hover:text-white hover:bg-white/12 transition-colors disabled:opacity-45"
                    >
                      {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      Save
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 hover:bg-red-500/15 transition-colors disabled:opacity-45"
                    >
                      {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      Delete
                    </button>
                  </div>
                </div>

                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Write your note here..."
                  className="flex-1 w-full resize-none bg-transparent p-5 text-sm leading-7 text-white/80 placeholder:text-white/25 outline-none"
                />

                <div className="px-5 py-3 border-t border-white/8 flex items-center justify-between text-xs text-white/30">
                  <span>Updated {formatDate(selectedNote.updated_at)}</span>
                  <span>{content.length} characters</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center max-w-sm"
                >
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                    <NotebookPen size={26} className="text-violet-300" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Open a note</h3>
                  <p className="text-sm text-white/35">Select a note from the list or create a new one.</p>
                </motion.div>
              </div>
            )}
          </section>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
