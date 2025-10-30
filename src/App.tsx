import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { GameHall } from './pages/GameHall'
import { ParentalControl } from './pages/ParentalControl'
import { PuzzlePage } from './pages/games/puzzle/PuzzlePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hall/:ageGroup" element={<GameHall />} />
        <Route path="/game/puzzle" element={<PuzzlePage />} />
        <Route path="/parental" element={<ParentalControl />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
