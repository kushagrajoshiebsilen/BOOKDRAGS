import React from 'react';
import { useBookStore } from './store/useBookStore';
import { DoorScreen } from './components/DoorScreen';
import { MainLibrary } from './components/MainLibrary';
import { ReadingRoom } from './components/ReadingRoom';
import { TableTopView } from './components/TableTopView';
import { BookModal } from './components/BookModal';
import { SearchOverlay } from './components/SearchOverlay';
import { DustParticles } from './components/DustParticles';
import { CandleOverlay } from './components/CandleOverlay';
import './styles/theme.css';

export function App() {
  const { activeScreen } = useBookStore();

  return (
    <div className="relative min-h-screen bg-[#0d0805] text-[#e8dcc4] font-body selection:bg-[#d4a24c] selection:text-[#1a120b]">
      {/* Visual Atmosphere Components */}
      <DustParticles />
      <CandleOverlay />

      {/* Screen Switcher */}
      {activeScreen === 'door' && <DoorScreen />}
      {activeScreen === 'main-library' && <MainLibrary />}
      {activeScreen === 'reading-room' && <ReadingRoom />}
      {activeScreen === 'table-closeup' && <TableTopView />}

      {/* Global Modals & Overlays */}
      <BookModal />
      <SearchOverlay />
    </div>
  );
}

export default App;
