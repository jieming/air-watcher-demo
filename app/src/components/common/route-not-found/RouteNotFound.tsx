import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import Typography from '@mui/material/Typography'

const styles: { root: CSSProperties } = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000000',
        color: '#ffffff',
    },
}

const RouteNotFound = () => {
    return (
        <div style={styles.root}>
            <Typography variant="h4">404 - Page not found</Typography>
            <Link to="/">Go to home</Link>
        </div>
    )
}

export default RouteNotFound
