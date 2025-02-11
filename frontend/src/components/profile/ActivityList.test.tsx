import { render, screen } from '@testing-library/react'
import ActivityList from './ActivityList'

describe('ActivityList', () => {
  it('renders activity list correctly', () => {
    const activities = [
      {
        id: '1',
        type: 'ride' as const,
        status: 'completed' as const,
        date: '2024-02-06T13:00:00Z',
        amount: '10.5',
        from: 'Location A',
        to: 'Location B'
      }
    ]

    render(<ActivityList activities={activities} />)
    
    expect(screen.getByText('Location A → Location B')).toBeInTheDocument()
    expect(screen.getByText('10.50 TON')).toBeInTheDocument()
    expect(screen.getByText('completed')).toBeInTheDocument()
  })

  it('renders empty state when no activities', () => {
    render(<ActivityList activities={[]} />)
    
    expect(screen.getByText('No activities to display')).toBeInTheDocument()
  })
})
