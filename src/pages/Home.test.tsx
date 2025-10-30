import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Home } from './Home'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Home Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
  }

  it('應該渲染標題', () => {
    renderHome()
    expect(screen.getByText('幼兒遊戲樂園')).toBeInTheDocument()
  })

  it('應該顯示兩個年齡組按鈕', () => {
    renderHome()
    expect(screen.getByText(/4-6 歲/)).toBeInTheDocument()
    expect(screen.getByText(/7-13 歲/)).toBeInTheDocument()
  })

  it('點擊 4-6 歲按鈕應該導航到遊戲大廳', () => {
    renderHome()

    const button = screen.getByRole('button', { name: /開始遊戲/i })
    const buttons = screen.getAllByRole('button', { name: /開始遊戲/i })

    // 點擊第一個（4-6歲）
    fireEvent.click(buttons[0])

    expect(mockNavigate).toHaveBeenCalledWith('/hall/4-6')
  })

  it('點擊 7-13 歲按鈕應該導航到遊戲大廳', () => {
    renderHome()

    const buttons = screen.getAllByRole('button', { name: /開始遊戲/i })

    // 點擊第二個（7-13歲）
    fireEvent.click(buttons[1])

    expect(mockNavigate).toHaveBeenCalledWith('/hall/7-13')
  })

  it('應該顯示音效控制按鈕', () => {
    renderHome()
    expect(screen.getByText(/音效/)).toBeInTheDocument()
  })

  it('應該顯示家長專區按鈕', () => {
    renderHome()
    expect(screen.getByText(/家長專區/)).toBeInTheDocument()
  })

  it('點擊家長專區應該導航到家長控制台', () => {
    renderHome()

    const parentalButton = screen.getByText(/家長專區/)
    fireEvent.click(parentalButton)

    expect(mockNavigate).toHaveBeenCalledWith('/parental')
  })

  it('點擊音效按鈕應該切換音效狀態', () => {
    renderHome()

    const soundButton = screen.getByText(/音效開啟/)
    fireEvent.click(soundButton)

    // 狀態應該切換
    expect(screen.getByText(/音效關閉/)).toBeInTheDocument()
  })
})
