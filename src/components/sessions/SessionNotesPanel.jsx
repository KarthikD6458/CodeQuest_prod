// src/components/sessions/SessionNotesPanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Edit, 
  Trash2, 
  X, 
  Check,
  Plus
} from 'lucide-react';
import { sessionsAPI } from '../../services/api';
import { formatTimeAgo } from '../../services/utils';
import Spinner from '../common/Spinner';

const SessionNotesPanel = ({ sessionId, onNoteAdded }) => {
  // State
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  
  // Load notes on mount and when sessionId changes
  useEffect(() => {
    if (sessionId) {
      loadNotes();
    }
  }, [sessionId]);
  
  // Load session notes
  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await sessionsAPI.getNotes(sessionId);
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle submit new note
  const handleSubmitNote = async (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;
    
    try {
      setSubmitting(true);
      const response = await sessionsAPI.addNote(sessionId, newNote.trim());
      setNotes(prev => [response.data, ...prev]);
      setNewNote('');
      
      // Notify parent if callback provided
      if (onNoteAdded) {
        onNoteAdded();
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Start editing a note
  const handleStartEditing = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
  };
  
  // Cancel editing
  const handleCancelEditing = () => {
    setEditingNoteId(null);
    setEditingNoteContent('');
  };
  
  // Save edited note
  const handleSaveEdit = async (noteId) => {
    try {
      // In a real app, you would update the note via API
      // For now, just update the local state
      setNotes(prev => 
        prev.map(note => 
          note.id === noteId 
            ? { ...note, content: editingNoteContent } 
            : note
        )
      );
      
      setEditingNoteId(null);
      setEditingNoteContent('');
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };
  
  // Delete note
  const handleDeleteNote = async (noteId) => {
    try {
      // In a real app, you would delete the note via API
      // For now, just update the local state
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
          Session Notes
        </h3>
      </div>
      
      {/* New Note Form */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmitNote}>
          <div className="mb-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this session..."
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newNote.trim() || submitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-1.5" />
              )}
              Add Note
            </button>
          </div>
        </form>
      </div>
      
      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Notes Yet</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Add your first note to keep track of important information about this session.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingNoteContent}
                      onChange={(e) => setEditingNoteContent(e.target.value)}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    ></textarea>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancelEditing}
                        className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm flex items-center"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-900 dark:text-white mb-3">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4 mr-1" />
                        <span>{note.username || 'You'}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatTimeAgo(note.created_at)}</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleStartEditing(note)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionNotesPanel;