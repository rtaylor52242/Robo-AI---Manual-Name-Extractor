
import React from 'react';
import { XMarkIcon } from './icons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 text-gray-300 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">How to Use</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close help modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <h3 className="font-semibold text-lg text-cyan-300 mb-2">1. Upload Video</h3>
                <p>Click the <span className="font-mono bg-gray-700 px-2 py-1 rounded">Upload Video</span> button to select a video file from your computer.</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-cyan-300 mb-2">2. Player Controls</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Use the main button to <strong>Play/Pause</strong> the video.</li>
                    <li>Click the step buttons or use the <kbd className="font-mono bg-gray-700 px-2 py-1 rounded">←</kbd> and <kbd className="font-mono bg-gray-700 px-2 py-1 rounded">→</kbd> arrow keys to move frame by frame.</li>
                    <li>Press the <kbd className="font-mono bg-gray-700 px-2 py-1 rounded">Spacebar</kbd> to toggle play/pause.</li>
                    <li>Drag the progress bar to seek to a specific time.</li>
                    <li>Change the playback speed using the dropdown menu (e.g., 0.5x, 2x).</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-cyan-300 mb-2">3. Extract Names</h3>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Pause the video when a name is visible.</li>
                    <li>Type the name into the "Add Name" input box.</li>
                    <li>Press <kbd className="font-mono bg-gray-700 px-2 py-1 rounded">Enter</kbd> or click the <span className="font-mono bg-gray-700 px-2 py-1 rounded">Add Name</span> button to capture the name and the current video timestamp.</li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg text-cyan-300 mb-2">4. Manage List</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Deduplicate:</strong> Toggle this to show only the first instance of each unique name found.</li>
                    <li><strong>Sort:</strong> Change the list order by entry time, or alphabetically (A-Z, Z-A).</li>
                    <li><strong>Delete:</strong> Click the trash icon <span className="inline-block text-red-500">(🗑️)</span> to remove an entry.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-cyan-300 mb-2">5. Export Data</h3>
                <p>When you are finished, click <span className="font-mono bg-green-700 px-2 py-1 rounded">CSV</span> or <span className="font-mono bg-blue-700 px-2 py-1 rounded">Excel</span> to download your extracted list.</p>
            </div>
        </div>
        <div className="mt-6 text-right">
            <button
                onClick={onClose}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Got it!
            </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;