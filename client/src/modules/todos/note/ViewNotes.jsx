import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../hooks/AuthContext';
import axiosInstance from '../../../api/axiosInstance';
import Transitions from '../../../components/Transitions';

function ViewNotes() {
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [editingNote, setEditingNote] = useState(null);
    const [editedNote, setEditedNote] = useState({ title: '', description: '' });

    const loadNotes = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/notes/user/${user.emailId}`);
            const notesData = response.data.notes || response.data;
            setNotes(Array.isArray(notesData) ? notesData : []);
        } catch (error) {
            console.error("Failed to load notes:", error);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadNotes();
        }
    }, [user]);

    const handleDelete = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                setActionLoading(prev => ({ ...prev, [`delete_${noteId}`]: true }));
                await axiosInstance.delete(`/notes/${noteId}`);
                await loadNotes();
            } catch (error) {
                console.error("Failed to delete note:", error);
            } finally {
                setActionLoading(prev => ({ ...prev, [`delete_${noteId}`]: false }));
            }
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note.noteId);
        setEditedNote({
            title: note.title,
            description: note.description
        });
    };

    const handleUpdate = async (noteId) => {
        try {
            setActionLoading(prev => ({ ...prev, [`update_${noteId}`]: true }));
            await axiosInstance.put(`/notes/${noteId}`, {
                ...editedNote,
                user: user.emailId
            });
            await loadNotes();
            setEditingNote(null);
        } catch (error) {
            console.error("Failed to update note:", error);
        } finally {
            setActionLoading(prev => ({ ...prev, [`update_${noteId}`]: false }));
        }
    };

    const handleCancelEdit = () => {
        setEditingNote(null);
        setEditedNote({ title: '', description: '' });
    };

    return (
        <Transitions>
            <div className="fixed right-0 top-16 lg:w-[calc(100vw-5rem)] w-screen md:h-[calc(100vh-8rem)] px-6 py-4 noscrollbar overflow-y-scroll h-[calc(100vh-9rem)] pb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">My Notes</h1>
                    <a href="/note" className="px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300">
                        Create Note
                    </a>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading notes...</div>
                    </div>
                ) : !notes || notes.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-2xl text-gray-600 dark:text-gray-400">No notes found</p>
                        <a href="/note" className="mt-4 inline-block px-6 py-3 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300">
                            Create Your First Note
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {notes && notes.map((note) => (
                            <div
                                key={note.noteId}
                                className="p-6 rounded-lg border-2 bg-yellow-50/50 dark:bg-cyan-900/50 border-yellow-300 dark:border-cyan-600 shadow-lg transition-all hover:shadow-xl flex flex-col"
                            >
                                {editingNote === note.noteId ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedNote.title}
                                            onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                                            className="w-full text-xl font-bold mb-3 px-2 py-1 border border-yellow-300 dark:border-cyan-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                            placeholder="Note title"
                                        />
                                        <textarea
                                            value={editedNote.description}
                                            onChange={(e) => setEditedNote({ ...editedNote, description: e.target.value })}
                                            className="w-full mb-4 px-2 py-1 border border-yellow-300 dark:border-cyan-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 min-h-[100px]"
                                            placeholder="Note description"
                                        />
                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                disabled={actionLoading[`update_${note.noteId}`]}
                                                onClick={() => handleUpdate(note.noteId)}
                                                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {actionLoading[`update_${note.noteId}`] && <span className="loading loading-spinner loading-sm"></span>}
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex-1 px-4 py-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 text-white rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                                            {note.title}
                                        </h3>
                                        
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                                            {note.description}
                                        </p>

                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            Created: {new Date(note.createdOn).toLocaleDateString()}
                                        </div>

                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => handleEdit(note)}
                                                className="flex-1 px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                disabled={actionLoading[`delete_${note.noteId}`]}
                                                onClick={() => handleDelete(note.noteId)}
                                                className="flex-1 px-4 py-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 text-white rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {actionLoading[`delete_${note.noteId}`] && <span className="loading loading-spinner loading-sm"></span>}
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Transitions>
    );
}

export default ViewNotes;
