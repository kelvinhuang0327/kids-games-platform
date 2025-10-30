import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('應該渲染按鈕文字', () => {
    render(<Button>點擊我</Button>)
    expect(screen.getByText('點擊我')).toBeInTheDocument()
  })

  it('點擊時應該調用 onClick', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>點擊我</Button>)

    fireEvent.click(screen.getByText('點擊我'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disabled 時不應該觸發 onClick', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>點擊我</Button>)

    const button = screen.getByText('點擊我')
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('應該應用正確的 variant 類名', () => {
    const { rerender } = render(<Button variant="toddler">幼兒</Button>)
    expect(screen.getByText('幼兒')).toHaveClass('bg-toddler-primary')

    rerender(<Button variant="kids">兒童</Button>)
    expect(screen.getByText('兒童')).toHaveClass('bg-kids-primary')
  })

  it('應該應用正確的 size 類名', () => {
    const { rerender } = render(<Button size="sm">小</Button>)
    expect(screen.getByText('小')).toHaveClass('px-6', 'py-3')

    rerender(<Button size="lg">大</Button>)
    expect(screen.getByText('大')).toHaveClass('px-12', 'py-6')
  })
})
