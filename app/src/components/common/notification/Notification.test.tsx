import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Notification from './Notification'
import snackbarReducer from '../../../store/snackbarSlice'

interface SnackbarState {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
}

const createTestStore = (initialState: Partial<SnackbarState> = {}) => {
    return configureStore({
        reducer: {
            snackbar: snackbarReducer,
        },
        preloadedState: {
            snackbar: {
                open: false,
                message: '',
                severity: 'success',
                ...initialState,
            } as SnackbarState,
        },
    })
}

describe('Notification', () => {
    it('should close by default and open when message is set', () => {
        const closedStore = createTestStore({ open: false })
        const { rerender } = render(
            <Provider store={closedStore}>
                <Notification />
            </Provider>
        )

        expect(screen.queryByRole('alert')).not.toBeInTheDocument()

        const openStore = createTestStore({
            open: true,
            message: 'Test message',
            severity: 'info',
        })
        rerender(
            <Provider store={openStore}>
                <Notification />
            </Provider>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText('Test message')).toBeInTheDocument()
    })

    it('should display all severity levels correctly', () => {
        const severities: Array<'error' | 'success' | 'warning' | 'info'> = [
            'error',
            'success',
            'warning',
            'info',
        ]

        severities.forEach(severity => {
            const store = createTestStore({
                open: true,
                message: `${severity} message`,
                severity,
            })
            const { unmount } = render(
                <Provider store={store}>
                    <Notification />
                </Provider>
            )

            const alert = screen.getByRole('alert')
            expect(alert).toBeInTheDocument()
            expect(alert).toHaveTextContent(`${severity} message`)

            unmount()
        })
    })

    it('should close when close button is clicked and update store state', async () => {
        const user = userEvent.setup()
        const store = createTestStore({
            open: true,
            message: 'Test message',
            severity: 'info',
        })
        render(
            <Provider store={store}>
                <Notification />
            </Provider>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()

        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        await waitFor(() => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        })

        const state = store.getState()
        expect(state.snackbar.open).toBe(false)
    })
})
