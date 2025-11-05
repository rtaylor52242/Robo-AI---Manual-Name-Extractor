
import React, { useState } from 'react';

interface NameEntryPanelProps {
  onAddName: (name: string) => void;
  disabled: boolean;
}

const NameEntryPanel: React.FC<NameEntryPanelProps> = ({ onAddName, disabled }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddName(name.trim());
      setName('');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-cyan-400">Add Name</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type or paste name here..."
          className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
          disabled={disabled}
        />
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || !name.trim()}
        >
          Add Name (Enter)
        </button>
      </form>
    </div>
  );
};

export default NameEntryPanel;
