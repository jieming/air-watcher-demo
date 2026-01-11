import { render, screen } from '@testing-library/react'
import WatchCityListContainer from './WatchCityListContainer'
import type { WatchCityQuery } from './watch-list-types'

vi.mock('@apollo/client/react', () => ({
    useQuery: vi.fn(),
}))

vi.mock('./WatchCityList', () => ({
    default: vi.fn(({ cities }) => (
        <div data-testid="watch-city-list">Cities: {cities.length}</div>
    )),
}))

vi.mock('../common/loading-indicator/LoadingIndicator', () => ({
    default: vi.fn(() => <div data-testid="loading-indicator">Loading...</div>),
}))

import { useQuery } from '@apollo/client/react'

describe('WatchCityListContainer', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render LoadingIndicator when loading', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: true,
            error: undefined,
            data: undefined,
        } as any)

        render(<WatchCityListContainer />)
        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    })

    it('should render error message when there is an error', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: { message: 'Network error' },
            data: undefined,
        } as any)

        render(<WatchCityListContainer />)
        expect(screen.getByText('Error: Network error')).toBeInTheDocument()
    })

    it('should render WatchCityList with cities data', () => {
        const mockData: WatchCityQuery = {
            watchCities: [
                { id: '1', name: 'London', filterWear: 100 },
                { id: '2', name: 'Paris', filterWear: 250 },
            ],
        }

        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: mockData,
        } as any)

        render(<WatchCityListContainer />)
        expect(screen.getByTestId('watch-city-list')).toBeInTheDocument()
        expect(screen.getByText('Cities: 2')).toBeInTheDocument()
    })

    it('should render WatchCityList with empty array when data is undefined', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: undefined,
        } as any)

        render(<WatchCityListContainer />)
        expect(screen.getByTestId('watch-city-list')).toBeInTheDocument()
        expect(screen.getByText('Cities: 0')).toBeInTheDocument()
    })
})
