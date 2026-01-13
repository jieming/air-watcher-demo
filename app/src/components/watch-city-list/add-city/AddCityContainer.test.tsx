import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddCityContainer from './AddCityContainer'

describe('AddCityContainer', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render FAB button', () => {
        render(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        expect(fabButton).toBeInTheDocument()
    })

    it('should open dialog when FAB button is clicked', async () => {
        const user = userEvent.setup()
        render(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        expect(screen.getByText('Add City')).toBeInTheDocument()
    })

    it('should close dialog when Cancel is clicked', async () => {
        const user = userEvent.setup()
        render(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        expect(screen.getByText('Add City')).toBeInTheDocument()

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        await waitFor(() => {
            expect(screen.queryByText('Add City')).not.toBeInTheDocument()
        })
    })

    it('should close dialog and log city name when Add is clicked', async () => {
        const user = userEvent.setup()
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        render(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'Tokyo')

        const addButton = screen.getByRole('button', { name: 'Add' })
        await user.click(addButton)

        expect(consoleSpy).toHaveBeenCalledWith('City name:', 'Tokyo')

        consoleSpy.mockRestore()
    })

    it('should submit city when Enter key is pressed', async () => {
        const user = userEvent.setup()
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        render(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'Sydney')
        await user.keyboard('{Enter}')

        expect(consoleSpy).toHaveBeenCalledWith('City name:', 'Sydney')

        consoleSpy.mockRestore()
    })
})
