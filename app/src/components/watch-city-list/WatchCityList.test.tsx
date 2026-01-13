import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import WatchCityList from './WatchCityList'
import type { WatchCity } from './watch-list-types'

vi.mock('./add-city/AddCityContainer', () => ({
    default: () => <div data-testid="add-city-container">AddCityContainer</div>,
}))

describe('WatchCityList', () => {
    it('should render DataGrid with column headers', () => {
        render(
            <MemoryRouter>
                <WatchCityList cities={[]} />
            </MemoryRouter>
        )
        expect(screen.getByText('City Name')).toBeInTheDocument()
        expect(screen.getByText('Filter Wear')).toBeInTheDocument()
    })

    it('should render empty DataGrid when no cities are provided', () => {
        render(
            <MemoryRouter>
                <WatchCityList cities={[]} />
            </MemoryRouter>
        )
        expect(screen.getByText('City Name')).toBeInTheDocument()
        expect(screen.getByText('Filter Wear')).toBeInTheDocument()
        expect(screen.getByText('No rows')).toBeInTheDocument()
    })

    it('should render a single city in DataGrid', () => {
        const cities: WatchCity[] = [
            { id: '1', name: 'London', filterWear: 100 },
        ]
        render(
            <MemoryRouter>
                <WatchCityList cities={cities} />
            </MemoryRouter>
        )

        expect(screen.getByText('London')).toBeInTheDocument()
        const filterWearCell = screen.getByTestId('filter-wear-cell-1')
        expect(filterWearCell).toBeInTheDocument()
        expect(filterWearCell).toHaveTextContent('100')
    })

    it('should render city name as a Link with correct href', () => {
        const cities: WatchCity[] = [
            { id: '1', name: 'London', filterWear: 100 },
        ]
        render(
            <MemoryRouter>
                <WatchCityList cities={cities} />
            </MemoryRouter>
        )

        const cityLink = screen.getByTestId('city-name-link-1')
        expect(cityLink).toBeInTheDocument()
        expect(cityLink).toHaveTextContent('London')
        expect(cityLink).toHaveAttribute('href', '/watch-list/1')
    })

    it('should render multiple cities in DataGrid', () => {
        const cities: WatchCity[] = [
            { id: '1', name: 'London', filterWear: 100 },
            { id: '2', name: 'Paris', filterWear: 250 },
            { id: '3', name: 'Berlin', filterWear: 50 },
            { id: '4', name: 'Madrid', filterWear: 0 },
        ]
        render(
            <MemoryRouter>
                <WatchCityList cities={cities} />
            </MemoryRouter>
        )

        expect(screen.getByText('London')).toBeInTheDocument()
        expect(screen.getByText('Paris')).toBeInTheDocument()
        expect(screen.getByText('Berlin')).toBeInTheDocument()
        expect(screen.getByText('Madrid')).toBeInTheDocument()

        const link1 = screen.getByTestId('city-name-link-1')
        expect(link1).toHaveAttribute('href', '/watch-list/1')

        const link2 = screen.getByTestId('city-name-link-2')
        expect(link2).toHaveAttribute('href', '/watch-list/2')

        const link3 = screen.getByTestId('city-name-link-3')
        expect(link3).toHaveAttribute('href', '/watch-list/3')

        const lin4 = screen.getByTestId('city-name-link-4')
        expect(lin4).toHaveAttribute('href', '/watch-list/4')

        const filterWear1 = screen.getByTestId('filter-wear-cell-1')
        expect(filterWear1).toBeInTheDocument()
        expect(filterWear1).toHaveTextContent('100')

        const filterWear2 = screen.getByTestId('filter-wear-cell-2')
        expect(filterWear2).toBeInTheDocument()
        expect(filterWear2).toHaveTextContent('250')

        const filterWear3 = screen.getByTestId('filter-wear-cell-3')
        expect(filterWear3).toBeInTheDocument()
        expect(filterWear3).toHaveTextContent('50')

        const filterWear4 = screen.getByTestId('filter-wear-cell-4')
        expect(filterWear4).toBeInTheDocument()
        expect(filterWear4).toHaveTextContent('0')
    })

    it('should render multiple city names as Links with correct hrefs', () => {
        const cities: WatchCity[] = [
            { id: '1', name: 'London', filterWear: 100 },
            { id: '2', name: 'Paris', filterWear: 250 },
        ]
        render(
            <MemoryRouter>
                <WatchCityList cities={cities} />
            </MemoryRouter>
        )

        const londonLink = screen.getByTestId('city-name-link-1')
        expect(londonLink).toHaveAttribute('href', '/watch-list/1')

        const parisLink = screen.getByTestId('city-name-link-2')
        expect(parisLink).toHaveAttribute('href', '/watch-list/2')
    })

    it('should render Outlet with child route content', () => {
        const cities: WatchCity[] = [
            { id: '1', name: 'London', filterWear: 100 },
        ]
        const TestChild = () => (
            <div data-testid="outlet-content">Outlet Content</div>
        )

        render(
            <MemoryRouter initialEntries={['/watch-list/1']}>
                <Routes>
                    <Route
                        path="/watch-list"
                        element={<WatchCityList cities={cities} />}
                    >
                        <Route path=":cityId" element={<TestChild />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('London')).toBeInTheDocument()
        expect(screen.getByTestId('outlet-content')).toBeInTheDocument()
        expect(screen.getByText('Outlet Content')).toBeInTheDocument()
    })

    it('should render AddCityContainer', () => {
        render(
            <MemoryRouter>
                <WatchCityList cities={[]} />
            </MemoryRouter>
        )
        expect(screen.getByTestId('add-city-container')).toBeInTheDocument()
    })
})
