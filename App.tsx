
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { NameEntry, Settings, SortMode } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import NameEntryPanel from './components/NameEntryPanel';
import NameListTable from './components/NameListTable';

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [names, setNames] = useLocalStorage<NameEntry[]>('nameEntries', []);
  const [settings, setSettings] = useLocalStorage<Settings>('settings', {
    dedupe: true,
    sortMode: SortMode.Chronological,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const addName = (name: string) => {
    if (!videoRef.current) return;
    const newEntry: NameEntry = {
      id: crypto.randomUUID(),
      name,
      timestamp: videoRef.current.currentTime,
      addedAt: new Date().toISOString(),
    };
    setNames(prev => [...prev, newEntry]);
  };
  
  const removeName = (id: string) => {
    setNames(prev => prev.filter(entry => entry.id !== id));
  };
  
  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const displayedNames = useMemo(() => {
    let processedNames = [...names];

    if (settings.dedupe) {
      const seen = new Set<string>();
      processedNames = processedNames.filter(entry => {
        const normalizedName = entry.name.trim().toLowerCase();
        if (seen.has(normalizedName)) {
          return false;
        } else {
          seen.add(normalizedName);
          return true;
        }
      });
    }

    switch (settings.sortMode) {
      case SortMode.AlphabeticalAsc:
        processedNames.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortMode.AlphabeticalDesc:
        processedNames.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case SortMode.Chronological:
        processedNames.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
        break;
    }
    
    return processedNames;
  }, [names, settings]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!videoRef.current) return;
    
    // Allow typing in inputs
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
        return;
    }

    switch (event.key) {
        case 'ArrowRight':
            event.preventDefault();
            videoRef.current.currentTime += 1 / 30; // Step forward one frame
            break;
        case 'ArrowLeft':
            event.preventDefault();
            videoRef.current.currentTime -= 1 / 30; // Step back one frame
            break;
        case ' ': // Space bar for play/pause
             event.preventDefault();
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
            break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header
        onFileChange={handleFileChange}
        entries={displayedNames}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        videoFileName={videoFile?.name ?? null}
      />
      <main className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Left column: Video Player */}
        <div className="lg:col-span-2 flex flex-col">
          <VideoPlayer videoSrc={videoSrc} videoRef={videoRef} />
        </div>
        
        {/* Right column: Entry Panel & Name List */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
          <NameEntryPanel onAddName={addName} disabled={!videoSrc} />
          <NameListTable entries={displayedNames} onRemoveName={removeName} allEntries={names} dedupe={settings.dedupe} />
        </div>
      </main>
    </div>
  );
}

export default App;
