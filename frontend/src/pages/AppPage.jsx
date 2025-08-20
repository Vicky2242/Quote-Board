import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const AppPage = () => {
  const [text, setText] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const getQuotes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/quotes");
      setQuotes(res.data);
    } catch (err) {
      console.error("Error fetching quotes:", err);
    }
  };

  const handleAdd = async () => {
    if (!text.trim()) {
      alert("Please fill the text");
      return;
    }
    try {
      await axios.post("http://localhost:4000/api/quotes", { text });
      setText("");
      getQuotes();
    } catch (err) {
      console.error("Error adding quote:", err);
    }
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:4000/api/quotes/${id}`);
        getQuotes();
      } catch (err) {
        console.error("Error deleting quote:", err);
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingText.trim()) {
      alert("Please fill the quote to edit");
      return;
    }
    try {
      await axios.put(`http://localhost:4000/api/quotes/${editingId}`, {
        text: editingText,
      });
      setEditingId(null);
      setEditingText("");
      getQuotes();
    } catch (err) {
      console.error("Error updating quote:", err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingText("");
  };

  useEffect(() => {
    getQuotes();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-12 px-4 md:px-10'>
      <h1 className='text-4xl font-bold text-center mb-10 text-[#6F36E8]'>
        📚My Quotes App
      </h1>

      <div className='max-w-xl mx-auto flex gap-4 mb-10'>
        <input
          type='text'
          placeholder='Type your quotes...'
          className='w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className='bg-[#6F36E8] text-white px-6 py-2 rounded-md hover:bg-[#5c2ec4]'
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      <div className='max-w-xl mx-auto space-y-4'>
        {quotes.map((q) => (
          <div key={q._id} className='bg-white shadow-md rounded-lg p-4 flex flex-col'>
            {editingId === q._id ? (
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className='w-full px-3 py-2 border rounded-md'
                />
                <div className='flex gap-2'>
                  <button
                    className='bg-green-500 text-white px-3 py-2 rounded-md flex items-center gap-1'
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                  <button
                    className='bg-gray-500 text-white px-3 py-2 rounded-md flex items-center gap-1'
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex justify-between w-full items-center'>
                <p>{q.text}</p>
                <div className='flex gap-4'>
                  <button
                    className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
                    onClick={() => startEdit(q._id, q.text)}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    className='text-red-600 hover:text-red-800 flex items-center gap-1'
                    onClick={() => handleDelete(q._id)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppPage;