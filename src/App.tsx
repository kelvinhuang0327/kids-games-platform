import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { GameHall } from './pages/GameHall'
import { PuzzlePage } from './pages/games/PuzzlePage'
import { MazePage } from './pages/games/MazePage'
import { ColorMatchPage } from './pages/games/ColorMatchPage'
import { MemoryCardPage } from './pages/games/MemoryCardPage'
import { StoryPage } from './pages/games/StoryPage'
import { StrategyMazePage } from './pages/games/StrategyMazePage'
import { SudokuPage } from './pages/games/SudokuPage'
import { TimeManagementPage } from './pages/games/TimeManagementPage'
import { ShapeMatchPage } from './pages/games/ShapeMatchPage'
import { TrafficSafetyPage } from './pages/games/TrafficSafetyPage'
import { FruitSlicePage } from './pages/games/FruitSlicePage'
import { MathChallengePage } from './pages/games/MathChallengePage'
import { SpellWizardPage } from './pages/games/SpellWizardPage'
import { ParentalControl } from './pages/ParentalControl'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hall/:ageGroup" element={<GameHall />} />
        <Route path="/game/puzzle" element={<PuzzlePage />} />
        <Route path="/game/maze" element={<MazePage />} />
        <Route path="/game/color-match" element={<ColorMatchPage />} />
        <Route path="/game/memory" element={<MemoryCardPage />} />
        <Route path="/game/story" element={<StoryPage />} />
        <Route path="/game/strategy-maze" element={<StrategyMazePage />} />
        <Route path="/game/sudoku" element={<SudokuPage />} />
        <Route path="/game/time-management" element={<TimeManagementPage />} />
        <Route path="/game/shape-match" element={<ShapeMatchPage />} />
        <Route path="/game/traffic-safety" element={<TrafficSafetyPage />} />
        <Route path="/game/fruit-slice" element={<FruitSlicePage />} />
        <Route path="/game/math-challenge" element={<MathChallengePage />} />
        <Route path="/game/spell-wizard" element={<SpellWizardPage />} />
        <Route path="/parent" element={<ParentalControl />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
