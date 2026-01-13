import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import AddCityContainer from './AddCityContainer'
import snackbarReducer from '../../../store/snackbarSlice'

vi.mock('@apollo/client/react', () => ({
    useMutation: vi.fn(),
}))

const createTestStore = () => {
    return configureStore({
        reducer: {
            snackbar: snackbarReducer,
        },
    })
}

const renderWithProviders = (component: React.ReactElement) => {
    const store = createTestStore()
    return render(<Provider store={store}>{component}</Provider>)
}

const setupUseMutation = async (mockMutate?: any): Promise<void> => {
    const { useMutation } = await import('@apollo/client/react')
    const mutate = mockMutate || vi.fn().mockResolvedValue({})
    vi.mocked(useMutation).mockReturnValue([
        mutate,
        { loading: false, error: undefined },
    ] as any)
}

describe('AddCityContainer', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render FAB button', async () => {
        await setupUseMutation()

        renderWithProviders(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        expect(fabButton).toBeInTheDocument()
    })

    it('should open dialog when FAB button is clicked', async () => {
        const user = userEvent.setup()
        await setupUseMutation()

        renderWithProviders(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        expect(screen.getByText('Add City')).toBeInTheDocument()
    })

    it('should close dialog when Cancel is clicked', async () => {
        const user = userEvent.setup()
        await setupUseMutation()

        renderWithProviders(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        expect(screen.getByText('Add City')).toBeInTheDocument()

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        await waitFor(() => {
            expect(screen.queryByText('Add City')).not.toBeInTheDocument()
        })
    })

    it('should close dialog and call mutation when Add is clicked', async () => {
        const user = userEvent.setup()
        const mockMutate = vi.fn().mockResolvedValue({})
        await setupUseMutation(mockMutate)

        renderWithProviders(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'Tokyo')

        const addButton = screen.getByRole('button', { name: 'Add' })
        await user.click(addButton)

        expect(mockMutate).toHaveBeenCalledWith({
            variables: {
                name: 'Tokyo',
                filterWear: 0,
            },
        })

        await waitFor(() => {
            expect(screen.queryByText('Add City')).not.toBeInTheDocument()
        })
    })

    it('should submit city when Enter key is pressed', async () => {
        const user = userEvent.setup()
        const mockMutate = vi.fn().mockResolvedValue({})
        await setupUseMutation(mockMutate)

        renderWithProviders(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'Sydney')
        await user.keyboard('{Enter}')

        expect(mockMutate).toHaveBeenCalledWith({
            variables: {
                name: 'Sydney',
                filterWear: 0,
            },
        })

        await waitFor(() => {
            expect(screen.queryByText('Add City')).not.toBeInTheDocument()
        })
    })
})
