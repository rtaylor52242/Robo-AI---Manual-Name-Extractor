
import React, { useState } from 'react';
import { NameEntry, Settings, SortMode } from '../types';
import { UploadIcon, DownloadIcon, QuestionMarkCircleIcon } from './icons';
import HelpModal from './HelpModal';

// Make sure XLSX and saveAs are declared for TypeScript
declare const XLSX: any;
declare const saveAs: any;

interface HeaderProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  entries: NameEntry[];
  settings: Settings;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
  videoFileName: string | null;
}

const Header: React.FC<HeaderProps> = ({ onFileChange, entries, settings, onSettingsChange, videoFileName }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    
  const handleExportCSV = () => {
    if (entries.length === 0) {
      alert('No names to export.');
      return;
    }
    const headers = ['#', 'Name', 'Timestamp (s)', 'Added At'];
    const rows = entries.map((entry, index) => [
      index + 1,
      entry.name,
      entry.timestamp.toFixed(2),
      entry.addedAt,
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'extracted_names.csv');
  };

  const handleExportXLSX = () => {
    if (entries.length === 0) {
      alert('No names to export.');
      return;
    }
    const worksheetData = entries.map((entry, index) => ({
      '#': index + 1,
      'Name': entry.name,
      'Timestamp (s)': entry.timestamp.toFixed(2),
      'Added At': entry.addedAt,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Names');
    XLSX.writeFile(workbook, 'extracted_names.xlsx');
  };

  return (
    <>
      <header className="bg-gray-800 p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-cyan-400">Robo AI - Manual Name Extractor</h1>
          <label htmlFor="video-upload" className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
            <UploadIcon className="w-5 h-5" />
            <span>Upload Video</span>
          </label>
          <input id="video-upload" type="file" className="hidden" accept="video/*" onChange={onFileChange} />
          {videoFileName && <span className="text-sm text-gray-400 truncate max-w-xs">{videoFileName}</span>}
        </div>
        <div className="flex items-center gap-6">
          {/* Settings */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dedupe-toggle"
                className="form-checkbox h-5 w-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                checked={settings.dedupe}
                onChange={(e) => onSettingsChange({ dedupe: e.target.checked })}
              />
              <label htmlFor="dedupe-toggle" className="ml-2 text-sm font-medium">Deduplicate</label>
            </div>
            <select
              value={settings.sortMode}
              onChange={(e) => onSettingsChange({ sortMode: e.target.value as SortMode })}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2"
            >
              <option value={SortMode.Chronological}>Entry Order</option>
              <option value={SortMode.AlphabeticalAsc}>Sort A-Z</option>
              <option value={SortMode.AlphabeticalDesc}>Sort Z-A</option>
            </select>
          </div>

          {/* Export */}
          <div className="flex items-center gap-2">
            <button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
              <DownloadIcon className="w-5 h-5" /> CSV
            </button>
            <button onClick={handleExportXLSX} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
              <DownloadIcon className="w-5 h-5" /> Excel
            </button>
          </div>

          {/* Help Button */}
          <button 
            onClick={() => setIsHelpModalOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Show help"
          >
            <QuestionMarkCircleIcon className="w-7 h-7" />
          </button>
        </div>
      </header>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  );
};

export default Header;