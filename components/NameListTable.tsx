
import React from 'react';
import { NameEntry } from '../types';
import { TrashIcon } from './icons';

interface NameListTableProps {
  entries: NameEntry[];
  onRemoveName: (id: string) => void;
  allEntries: NameEntry[];
  dedupe: boolean;
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(2);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(5, '0')}`;
};

const NameListTable: React.FC<NameListTableProps> = ({ entries, onRemoveName, allEntries, dedupe }) => {
  
  const isDuplicate = (name: string): boolean => {
    if (!dedupe) return false;
    const normalizedName = name.trim().toLowerCase();
    return allEntries.filter(e => e.name.trim().toLowerCase() === normalizedName).length > 1;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex-grow overflow-hidden flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-cyan-400">Extracted Names ({entries.length})</h2>
      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 w-16">#</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Timestamp</th>
              <th scope="col" className="px-6 py-3">Added At</th>
              <th scope="col" className="px-6 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? entries.map((entry, index) => (
              <tr key={entry.id} className={`border-b border-gray-700 hover:bg-gray-700/50 ${isDuplicate(entry.name) ? 'bg-yellow-900/30' : ''}`}>
                <td className="px-6 py-4 font-medium">{index + 1}</td>
                <td className="px-6 py-4">{entry.name} {isDuplicate(entry.name) && <span className="text-yellow-500 text-xs ml-2">(Duplicate)</span>}</td>
                <td className="px-6 py-4">{formatTime(entry.timestamp)}</td>
                <td className="px-6 py-4">{new Date(entry.addedAt).toLocaleTimeString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => onRemoveName(entry.id)} className="text-red-500 hover:text-red-400">
                    <TrashIcon className="w-5 h-5"/>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No names added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NameListTable;
