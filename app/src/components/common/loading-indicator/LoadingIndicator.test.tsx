import { render, screen } from '@testing-library/react'
import LoadingIndicator from './LoadingIndicator'

describe('LoadingIndicator', () => {
    it('should render CircularProgress with correct size', () => {
        render(<LoadingIndicator />)
        const progress = screen.getByRole('progressbar')

        expect(progress).toBeInTheDocument()
        expect(progress).toHaveAttribute(
            'style',
            expect.stringContaining('width: 300px')
        )
    })
})
