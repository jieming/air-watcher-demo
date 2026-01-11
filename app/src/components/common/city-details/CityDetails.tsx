import Typography from '@mui/material/Typography'
import type { WatchCity } from '../../watch-city-list/watch-list-types'
import type { CSSProperties } from 'react'

const styles: { root: CSSProperties } = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000000',
        color: '#ffffff',
    },
}

const CityDetails = ({ city }: { city: WatchCity | undefined }) => {
    if (!city) {
        return (
            <div style={styles.root}>
                <Typography variant="h4">City not found</Typography>
            </div>
        )
    }

    return (
        <div style={styles.root}>
            <Typography variant="h4">{city.name}</Typography>
        </div>
    )
}

export default CityDetails
