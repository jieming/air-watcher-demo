import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import AddCityContainer from './AddCityContainer'
import snackbarReducer from '../../../store/snackbarSlice'

vi.mock('@apollo/client/react', () => ({
    useMutation: vi.fn(),
}))

vi.mock('../../../services/openweather_api', () => ({
    fetchGeocoding: vi.fn(),
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
    beforeEach(async () => {
        vi.clearAllMocks()
        const { fetchGeocoding } =
            await import('../../../services/openweather_api')
        vi.mocked(fetchGeocoding).mockResolvedValue({
            lat: 51.5085,
            lon: -0.1257,
        })
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
        const { fetchGeocoding } =
            await import('../../../services/openweather_api')

        renderWithProviders(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'Tokyo')

        const addButton = screen.getByRole('button', { name: 'Add' })
        await user.click(addButton)

        expect(fetchGeocoding).toHaveBeenCalledWith('Tokyo')
        expect(mockMutate).toHaveBeenCalledWith({
            variables: {
                name: 'Tokyo',
                filterWear: 0,
                lat: 51.5085,
                lon: -0.1257,
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
        const { fetchGeocoding } =
            await import('../../../services/openweather_api')

        renderWithProviders(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'Sydney')
        await user.keyboard('{Enter}')

        expect(fetchGeocoding).toHaveBeenCalledWith('Sydney')
        expect(mockMutate).toHaveBeenCalledWith({
            variables: {
                name: 'Sydney',
                filterWear: 0,
                lat: 51.5085,
                lon: -0.1257,
            },
        })

        await waitFor(() => {
            expect(screen.queryByText('Add City')).not.toBeInTheDocument()
        })
    })

    it('should format city name with first letter of each word uppercase', async () => {
        const user = userEvent.setup()
        const mockMutate = vi.fn().mockResolvedValue({})
        await setupUseMutation(mockMutate)
        const { fetchGeocoding } =
            await import('../../../services/openweather_api')

        renderWithProviders(<AddCityContainer />)

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'new york')

        const addButton = screen.getByRole('button', { name: 'Add' })
        await user.click(addButton)

        expect(fetchGeocoding).toHaveBeenCalledWith('New York')
        expect(mockMutate).toHaveBeenCalledWith({
            variables: {
                name: 'New York',
                filterWear: 0,
                lat: 51.5085,
                lon: -0.1257,
            },
        })
    })

    it('should show error notification and not call mutation when geocoding fails', async () => {
        const user = userEvent.setup()
        const { fetchGeocoding } =
            await import('../../../services/openweather_api')
        vi.mocked(fetchGeocoding).mockRejectedValue(
            new Error('Location not found')
        )
        const mockMutate = vi.fn().mockResolvedValue({})
        await setupUseMutation(mockMutate)

        const store = createTestStore()
        render(
            <Provider store={store}>
                <AddCityContainer />
            </Provider>
        )

        const fabButton = screen.getByRole('button', { name: 'add' })
        await user.click(fabButton)

        const input = screen.getByLabelText('City Name')
        await user.type(input, 'InvalidCity')

        const addButton = screen.getByRole('button', { name: 'Add' })
        await user.click(addButton)

        expect(mockMutate).not.toHaveBeenCalled()
        expect(screen.getByText('Add City')).toBeInTheDocument()

        const state = store.getState()
        expect(state.snackbar.open).toBe(true)
        expect(state.snackbar.message).toBe('Location not found')
        expect(state.snackbar.severity).toBe('error')
    })
})
