import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../hooks/AuthContext';
import axiosInstance from '../../../api/axiosInstance';
import Transitions from '../../../components/Transitions';

function ViewLists() {
    const { user } = useContext(AuthContext);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingList, setEditingList] = useState(null);
    const [editedList, setEditedList] = useState({ title: '', items: [] });
    const [newItemInput, setNewItemInput] = useState('');

    const loadLists = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/lists/user/${user.emailId}`);
            const listsData = response.data.lists || response.data;
            setLists(Array.isArray(listsData) ? listsData : []);
        } catch (error) {
            console.error("Failed to load lists:", error);
            setLists([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadLists();
        }
    }, [user]);

    const handleDelete = async (listId) => {
        if (window.confirm('Are you sure you want to delete this list?')) {
            try {
                await axiosInstance.delete(`/lists/${listId}`);
                await loadLists();
            } catch (error) {
                console.error("Failed to delete list:", error);
            }
        }
    };

    const handleEdit = (list) => {
        setEditingList(list.listId);
        setEditedList({
            title: list.title,
            items: [...list.items]
        });
    };

    const handleUpdate = async (listId) => {
        try {
            let newItems = [...editedList.items];
            if (newItemInput.trim() !== "") {
                newItems.push({ itemName: newItemInput.trim(), completed: false });
            }

            await axiosInstance.put(`/lists/${listId}`, {
                ...editedList,
                items: newItems,
                user: user.emailId
            });
            await loadLists();
            setEditingList(null);
            setNewItemInput('');
        } catch (error) {
            console.error("Failed to update list:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingList(null);
        setEditedList({ title: '', items: [] });
        setNewItemInput('');
    };

    const handleAddListItem = (e) => {
        if (e.key === "Enter" && newItemInput.trim() !== "") {
            setEditedList(prev => ({
                ...prev,
                items: [...prev.items, { itemName: newItemInput, completed: false }]
            }));
            setNewItemInput('');
        }
    };

    const handleToggleItem = (idx) => {
        setEditedList(prev => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === idx ? { ...item, completed: !item.completed } : item
            )
        }));
    };

    const handleDeleteItem = (idx) => {
        setEditedList(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx)
        }));
    };

    const handleToggleItemInList = async (list, itemIndex) => {
        try {
            const updatedItems = list.items.map((item, idx) =>
                idx === itemIndex ? { ...item, completed: !item.completed } : item
            );
            await axiosInstance.put(`/lists/${list.listId}`, {
                title: list.title,
                items: updatedItems,
                user: user.emailId
            });
            await loadLists();
        } catch (error) {
            console.error("Failed to toggle item:", error);
        }
    };

    return (
        <Transitions>
            <div className="fixed right-0 top-16 lg:w-[calc(100vw-5rem)] w-screen md:h-[calc(100vh-8rem)] px-6 py-4 noscrollbar overflow-y-scroll h-[calc(100vh-15rem)]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">My Lists</h1>
                    <a href="/list" className="px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300">
                        Create List
                    </a>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading lists...</div>
                    </div>
                ) : !lists || lists.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-2xl text-gray-600 dark:text-gray-400">No lists found</p>
                        <a href="/list" className="mt-4 inline-block px-6 py-3 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300">
                            Create Your First List
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {lists && lists.map((list) => (
                            <div
                                key={list.listId}
                                className="p-6 rounded-lg border-2 bg-yellow-50/50 dark:bg-cyan-900/50 border-yellow-300 dark:border-cyan-600 shadow-lg transition-all hover:shadow-xl flex flex-col"
                            >
                                {editingList === list.listId ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedList.title}
                                            onChange={(e) => setEditedList({ ...editedList, title: e.target.value })}
                                            className="w-full text-xl font-bold mb-3 px-2 py-1 border border-yellow-300 dark:border-cyan-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                            placeholder="List title"
                                        />
                                        <div className="mb-4 space-y-2">
                                            {editedList.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.completed}
                                                        onChange={() => handleToggleItem(idx)}
                                                        className="checkbox checkbox-sm checkbox-pink"
                                                    />
                                                    <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                                        {item.itemName}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteItem(idx)}
                                                        className="text-rose-500 hover:text-rose-700 cursor-pointer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                            <input
                                                type="text"
                                                value={newItemInput}
                                                onChange={(e) => setNewItemInput(e.target.value)}
                                                onKeyDown={handleAddListItem}
                                                className="w-full px-2 py-1 border border-yellow-300 dark:border-cyan-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                placeholder="Add new item (press Enter)"
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => handleUpdate(list.listId)}
                                                className="flex-1 px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300"
                                            >
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
                                            {list.title}
                                        </h3>
                                        
                                        <div className="mb-4 space-y-2 flex-grow overflow-y-auto">
                                            {list.items && list.items.length > 0 ? (
                                                list.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.completed}
                                                            onChange={() => handleToggleItemInList(list, idx)}
                                                            className="checkbox checkbox-sm checkbox-pink"
                                                        />
                                                        <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                                            {item.itemName}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm">No items in this list</p>
                                            )}
                                        </div>

                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {list.items ? `${list.items.filter(i => i.completed).length} / ${list.items.length} completed` : '0 items'}
                                        </div>

                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => handleEdit(list)}
                                                className="flex-1 px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(list.listId)}
                                                className="flex-1 px-4 py-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 text-white rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300"
                                            >
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

export default ViewLists;
