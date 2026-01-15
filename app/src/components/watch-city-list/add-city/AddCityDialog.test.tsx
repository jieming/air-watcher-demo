import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddCityDialog from './AddCityDialog'

describe('AddCityDialog', () => {
    const mockHandleClose = vi.fn()
    const mockHandleSubmit = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should not render when open is false', () => {
        render(
            <AddCityDialog
                open={false}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        expect(screen.queryByText('Add City')).not.toBeInTheDocument()
    })

    it('should render dialog when open is true', () => {
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        expect(screen.getByText('Add City')).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText(
                'The newly created city will start with 0 filter wear.'
            )
        ).toBeInTheDocument()
    })

    it('should render TextField with correct label and placeholder', () => {
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        expect(screen.getByLabelText('City Name')).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText(
                'The newly created city will start with 0 filter wear.'
            )
        ).toBeInTheDocument()
    })

    it('should disable Add button when input is empty', () => {
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const addButton = screen.getByRole('button', { name: 'Add' })
        expect(addButton).toBeDisabled()
    })

    it('should enable Add button when input has value', async () => {
        const user = userEvent.setup()
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'London')

        const addButton = screen.getByRole('button', { name: 'Add' })
        expect(addButton).not.toBeDisabled()
    })

    it('should call handleSubmit with city name when Add button is clicked', async () => {
        const user = userEvent.setup()
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'London')

        const addButton = screen.getByRole('button', { name: 'Add' })
        await user.click(addButton)

        expect(mockHandleSubmit).toHaveBeenCalledWith('London')
    })

    it('should call handleClose when Cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(mockHandleClose).toHaveBeenCalledTimes(1)
    })

    it('should call handleSubmit when Enter key is pressed with valid input', async () => {
        const user = userEvent.setup()
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'Paris')
        await user.keyboard('{Enter}')

        expect(mockHandleSubmit).toHaveBeenCalledWith('Paris')
    })

    it('should not call handleSubmit when Enter key is pressed with empty input', async () => {
        const user = userEvent.setup()
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const input = screen.getByLabelText('City Name')
        await user.click(input)
        await user.keyboard('{Enter}')

        expect(mockHandleSubmit).not.toHaveBeenCalled()
    })

    it('should reset input when dialog closes', async () => {
        const user = userEvent.setup()
        const { rerender } = render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const input = screen.getByLabelText('City Name') as HTMLInputElement
        await user.type(input, 'Berlin')

        expect(input.value).toBe('Berlin')

        rerender(
            <AddCityDialog
                open={false}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        rerender(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const newInput = screen.getByLabelText('City Name') as HTMLInputElement
        expect(newInput.value).toBe('')
    })

    it('should trim whitespace from input when submitting', async () => {
        const user = userEvent.setup()
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const input = screen.getByLabelText('City Name')
        await user.type(input, '  Madrid  ')

        const addButton = screen.getByRole('button', { name: 'Add' })
        await user.click(addButton)

        expect(mockHandleSubmit).toHaveBeenCalledWith('  Madrid  ')
    })

    it('should limit input to 50 characters', async () => {
        const user = userEvent.setup()
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const input = screen.getByLabelText('City Name') as HTMLInputElement
        const longName = 'a'.repeat(60)
        await user.type(input, longName)

        expect(input.value).toHaveLength(50)
    })

    it('should show character count at 50 characters', async () => {
        const user = userEvent.setup()
        render(
            <AddCityDialog
                open={true}
                handleClose={mockHandleClose}
                handleSubmit={mockHandleSubmit}
            />
        )

        const input = screen.getByLabelText('City Name')
        const longName = 'a'.repeat(50)
        await user.type(input, longName)

        expect(screen.getByText('50/50')).toBeInTheDocument()
    })
})
