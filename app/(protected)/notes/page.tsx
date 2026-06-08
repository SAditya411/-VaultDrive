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

      <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 min-h-[calc(100vh-120px)]">
          <aside className="glass-card rounded-[1.5rem] border border-white/70 overflow-hidden flex flex-col min-h-[360px]">
            <div className="p-4 border-b border-white/60 space-y-3">
              <button
                onClick={handleCreate}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-black hover:bg-black/85 text-white text-sm font-medium shadow-lg shadow-black/10 transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                New Note
              </button>

              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search notes"
                  className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/50 border border-white/70 text-sm text-black placeholder:text-black/30 outline-none focus:border-black/20 focus:bg-white/70 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loading && (
                <div className="h-48 flex items-center justify-center text-black/35">
                  <Loader2 size={20} className="animate-spin" />
                </div>
              )}

              {!loading && notes.length === 0 && (
                <div className="h-56 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/55 border border-white/70 flex items-center justify-center mb-3">
                    <NotebookPen size={20} className="text-black/35" />
                  </div>
                  <p className="text-sm font-medium text-black/65">No notes yet</p>
                  <p className="text-xs text-black/35 mt-1">Create one to start writing.</p>
                </div>
              )}

              {!loading && notes.map((note) => {
                const active = note.id === selectedId;
                const snippet = note.content.trim() || 'No content';

                return (
                  <button
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`w-full text-left p-3 rounded-2xl transition-colors mb-1.5 ${
                      active
                        ? 'bg-white/72 border border-white/90 shadow-sm'
                        : 'border border-transparent hover:bg-white/45'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        active ? 'bg-black text-white' : 'bg-white/55 text-black/35'
                      }`}>
                        <Edit3 size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-black truncate">{note.title}</p>
                        <p className="text-xs text-black/40 truncate mt-0.5">{snippet}</p>
                        <p className="text-[11px] text-black/30 mt-2">{formatDate(note.updated_at)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="glass-card rounded-[1.5rem] border border-white/70 overflow-hidden flex flex-col min-h-[520px]">
            {selectedNote ? (
              <>
                <div className="p-5 border-b border-white/60 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Note title"
                    className="flex-1 min-w-0 bg-transparent text-xl font-semibold text-black placeholder:text-black/30 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    {hasChanges && <span className="text-xs text-amber-700/80 px-2">Unsaved</span>}
                    <button
                      onClick={handleSave}
                      disabled={saving || !hasChanges}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black text-sm text-white hover:bg-black/85 transition-colors disabled:opacity-45"
                    >
                      {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      Save
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-sm text-red-700 hover:bg-red-500/15 transition-colors disabled:opacity-45"
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
                  className="flex-1 w-full resize-none bg-white/16 p-5 text-sm leading-7 text-black/75 placeholder:text-black/30 outline-none"
                />

                <div className="px-5 py-3 border-t border-white/60 flex items-center justify-between text-xs text-black/35">
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
                    <NotebookPen size={26} className="text-black/65" />
                  </div>
                  <h3 className="text-base font-semibold text-black mb-1">Open a note</h3>
                  <p className="text-sm text-black/40">Select a note from the list or create a new one.</p>
                </motion.div>
              </div>
            )}
          </section>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
