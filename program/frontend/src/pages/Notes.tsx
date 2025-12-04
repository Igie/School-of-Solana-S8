import { useNotesProgram } from "../hooks/useNotesProgram";
import { useEffect, useState } from "react";
import type { Notes } from "../lib/idl/notes";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { ellipsify } from "../utils";
import { BN } from '@coral-xyz/anchor'
import * as anchor from "@coral-xyz/anchor";

export interface Note {
  author: PublicKey;
  initTime: BN;
  name: string;
  value: string;
}

export default function Notes() {
  const { program } = useNotesProgram();
  const { publicKey } = useWallet();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState({ name: '', value: '' });
  const [editingNote, setEditingNote] = useState<{ index: number; note: Note } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ index: number; note: Note } | null>(null);

  useEffect(() => {
    if (!program || !publicKey) return;
    fetchNotes();
  }, [program, publicKey])

  function getNotePda(author: PublicKey, name: string) {
    return PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("notes"),
        author.toBuffer(),
        anchor.utils.bytes.utf8.encode(name),
      ], program!.programId)[0];
  }

  const handleCreateNote = async () => {
    setError('');

    if (!newNote.name.trim() || !newNote.value.trim()) {
      setError('Please fill in both name and value fields');
      return;
    }

    try {
      setIsLoading(true);
      const notePda = getNotePda(publicKey!, newNote.name);

      await program!.methods
        .initializeNote(newNote.name, newNote.value)
        .accountsPartial({
          note: notePda,
          signer: publicKey!,
        })
        .rpc();

      const mockNote: Note = {
        author: publicKey!,
        initTime: new BN(Date.now() / 1000),
        name: newNote.name,
        value: newNote.value,
      };
      setNotes([mockNote, ...notes]);
      setNewNote({ name: '', value: '' });
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create note');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNote = async (index: number) => {
    setError('');

    if (!editValue.trim()) {
      setError('Note content cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      const note = notes[index];
      const notePda = getNotePda(note.author, note.name);

      await program!.methods
        .editNote(editValue)
        .accountsPartial({
          note: notePda,
          signer: publicKey!,
        })
        .rpc();

      const updatedNotes = [...notes];
      updatedNotes[index] = { ...note, value: editValue };
      setNotes(updatedNotes);
      setEditingNote(null);
      setEditValue('');
    } catch (err: any) {
      setError(err.message || 'Failed to update note');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setError('');

    try {
      setIsLoading(true);
      const note = deleteConfirm.note;
      const notePda = getNotePda(note.author, note.name);

      await program!.methods
        .closeNote()
        .accountsPartial({
          note: notePda,
          signer: publicKey!,
        })
        .rpc();

      const updatedNotes = notes.filter((_, i) => i !== deleteConfirm.index);
      setNotes(updatedNotes);
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete note');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (index: number, note: Note) => {
    setEditingNote({ index, note });
    setEditValue(note.value);
    setError('');
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditValue('');
    setError('');
  };

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError('');

      const fetchedNotes = await program!.account.note.all([{
        memcmp: {
          encoding: "base58",
          offset: 8,
          bytes: publicKey!.toBase58(),
        }
      }]);
      setNotes(fetchedNotes.map(x => x.account));
    } catch (err) {
      setError('Failed to fetch notes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: BN) => {
    const date = new Date(timestamp.toNumber() * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto bg-linear-to-b from-surface/50 to-surface/30 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-surface rounded-lg ring ring-accent-1/10 shadow-lg shadow-accent-1/20 p-6 mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Notes App</h1>
          <p className="text-sm text-foreground font-mono">
            Program: {ellipsify(program?.programId.toBase58())}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-surface hover:bg-accent-hover/50 text-foreground px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
          >
            {isCreating ? 'Cancel' : '+ New Note'}
          </button>
          <button
            onClick={fetchNotes}
            disabled={isLoading}
            className="bg-surface hover:bg-accent-hover/50 text-foreground px-6 py-2 rounded-lg font-medium transition-colors shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh Notes'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-surface border-l border-b border-red-500 p-4 mb-6 rounded">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Create Note Form */}
        {isCreating && (
          <div className="bg-surface rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Create New Note</h2>
            <div>
              <div className="mb-4">
                <label className="block text-foreground font-medium mb-2">
                  Note Name
                </label>
                <input
                  type="text"
                  value={newNote.name}
                  onChange={(e) => setNewNote({ ...newNote, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-accent-1 focus:border-transparent outline-none"
                  placeholder="Enter note name"
                  maxLength={50}
                />
              </div>
              <div className="mb-4">
                <label className="block text-foreground font-medium mb-2">
                  Note Content
                </label>
                <textarea
                  value={newNote.value}
                  onChange={(e) => setNewNote({ ...newNote, value: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-accent-1 focus:border-transparent outline-none resize-none"
                  placeholder="Enter note content"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newNote.value.length}/500 characters
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateNote}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Note'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNote({ name: '', value: '' });
                    setError('');
                  }}
                  className="bg-surface hover:bg-accent-hover/50 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="bg-surface rounded-lg shadow-md p-12 text-center">
              <p className="text-accent-2 text-lg">No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div
                key={index}
                className="bg-surface rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {editingNote?.index === index ? (
                  <div>
                    <h3 className="text-xl font-semibold text-foreground/80 mb-4">{note.name}</h3>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-accent-1 focus:border-transparent outline-none resize-none mb-4"
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mb-4">
                      {editValue.length}/500 characters
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNote(index)}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={isLoading}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-foreground/80">{note.name}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(note.initTime)}
                      </span>
                    </div>
                    <p className="text-foreground mb-4 whitespace-pre-wrap">{note.value}</p>
                    <div className="flex items-center gap-1 justify-between">
                      <div className="flex items-center text-sm text-foreground/50">
                        <span className="font-medium mr-2">Author:</span>
                        <span className="font-mono">{ellipsify(note.author.toBase58())}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(index, note)}
                          disabled={isLoading}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ index, note })}
                          disabled={isLoading}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6 animate-in">
              <h3 className="text-xl font-bold text-foreground mb-3">Delete Note</h3>
              <p className="text-foreground/70 mb-2">
                Are you sure you want to delete this note?
              </p>
              <p className="text-foreground/90 font-semibold mb-6">
                "{deleteConfirm.note.name}"
              </p>
              <p className="text-sm text-foreground/60 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}