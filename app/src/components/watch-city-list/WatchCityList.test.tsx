import { render, screen } from '@testing-library/react'
import WatchCityList from './WatchCityList'
import type { WatchCity } from './watch-list-types'

describe('WatchCityList', () => {
    it('should render DataGrid with column headers', () => {
        render(<WatchCityList cities={[]} />)
        expect(screen.getByText('City Name')).toBeInTheDocument()
        expect(screen.getByText('Filter Wear')).toBeInTheDocument()
    })

    it('should render empty DataGrid when no cities are provided', () => {
        render(<WatchCityList cities={[]} />)
        expect(screen.getByText('City Name')).toBeInTheDocument()
        expect(screen.getByText('Filter Wear')).toBeInTheDocument()
        expect(screen.getByText('No rows')).toBeInTheDocument()
    })

    it('should render a single city in DataGrid', () => {
        const cities: WatchCity[] = [
            { id: '1', name: 'London', filterWear: 100 },
        ]
        render(<WatchCityList cities={cities} />)

        expect(screen.getByText('London')).toBeInTheDocument()
        const filterWearCell = screen.getByTestId('filter-wear-cell-1')
        expect(filterWearCell).toBeInTheDocument()
        expect(filterWearCell).toHaveTextContent('100')
    })

    it('should render multiple cities in DataGrid', () => {
        const cities: WatchCity[] = [
            { id: '1', name: 'London', filterWear: 100 },
            { id: '2', name: 'Paris', filterWear: 250 },
            { id: '3', name: 'Berlin', filterWear: 50 },
            { id: '4', name: 'Madrid', filterWear: 0 },
        ]
        render(<WatchCityList cities={cities} />)

        expect(screen.getByText('London')).toBeInTheDocument()
        expect(screen.getByText('Paris')).toBeInTheDocument()
        expect(screen.getByText('Berlin')).toBeInTheDocument()
        expect(screen.getByText('Madrid')).toBeInTheDocument()

        const filterWear100Cell = screen.getByTestId('filter-wear-cell-1')
        expect(filterWear100Cell).toBeInTheDocument()
        expect(filterWear100Cell).toHaveTextContent('100')

        const filterWear250Cell = screen.getByTestId('filter-wear-cell-2')
        expect(filterWear250Cell).toBeInTheDocument()
        expect(filterWear250Cell).toHaveTextContent('250')

        const filterWear50Cell = screen.getByTestId('filter-wear-cell-3')
        expect(filterWear50Cell).toBeInTheDocument()
        expect(filterWear50Cell).toHaveTextContent('50')

        const filterWear0Cell = screen.getByTestId('filter-wear-cell-4')
        expect(filterWear0Cell).toBeInTheDocument()
        expect(filterWear0Cell).toHaveTextContent('0')
    })
})
