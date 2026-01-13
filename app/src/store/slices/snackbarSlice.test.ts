import snackbarReducer, { showSnackbar, hideSnackbar } from './snackbarSlice'

describe('snackbarSlice', () => {
    it('should return initial state', () => {
        const state = snackbarReducer(undefined, { type: 'unknown' })
        expect(state).toEqual({
            open: false,
            message: '',
            severity: 'success',
        })
    })

    it('should handle showSnackbar with all severity levels', () => {
        const severities: Array<'success' | 'error' | 'warning' | 'info'> = [
            'success',
            'error',
            'warning',
            'info',
        ]

        severities.forEach(severity => {
            const state = snackbarReducer(
                undefined,
                showSnackbar({
                    message: `${severity} message`,
                    severity,
                })
            )
            expect(state.open).toBe(true)
            expect(state.message).toBe(`${severity} message`)
            expect(state.severity).toBe(severity)
        })
    })

    it('should use default severity success when not provided', () => {
        const state = snackbarReducer(
            undefined,
            showSnackbar({
                message: 'Test message',
            })
        )
        expect(state.open).toBe(true)
        expect(state.message).toBe('Test message')
        expect(state.severity).toBe('success')
    })

    it('should handle hideSnackbar', () => {
        const initialState = snackbarReducer(
            undefined,
            showSnackbar({
                message: 'Test message',
                severity: 'error',
            })
        )
        expect(initialState.open).toBe(true)

        const state = snackbarReducer(initialState, hideSnackbar())
        expect(state.open).toBe(false)
        expect(state.message).toBe('Test message')
        expect(state.severity).toBe('error')
    })
})
