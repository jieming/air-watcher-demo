import Typography from '@mui/material/Typography'
import type { WatchCity } from '../watch-city-list/watch-list-types'
import type { AirPollutionData } from '../../services/openweather_api'
import type { CSSProperties } from 'react'

const styles: { root: CSSProperties; coordinates: CSSProperties } = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000000',
        color: '#ffffff',
        gap: '16px',
    },
    coordinates: {
        marginTop: '16px',
        opacity: 0.8,
    },
}

interface CityDetailsProps {
    city: WatchCity | undefined
    coordinates: { lat: number; lon: number } | null
    coordinatesError: string | null
    airPollutionData: AirPollutionData | null
    airPollutionError: string | null
}

const CityDetails = ({
    city,
    coordinates,
    coordinatesError,
    airPollutionData,
    airPollutionError,
}: CityDetailsProps) => {
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
            {coordinatesError && (
                <Typography variant="body2" style={styles.coordinates}>
                    {coordinatesError}
                </Typography>
            )}
            {coordinates && (
                <Typography variant="body1" style={styles.coordinates}>
                    Latitude: {coordinates.lat.toFixed(4)}, Longitude:{' '}
                    {coordinates.lon.toFixed(4)}
                </Typography>
            )}
            {airPollutionError && (
                <Typography variant="body2" style={styles.coordinates}>
                    {airPollutionError}
                </Typography>
            )}
            {airPollutionData && (
                <div style={styles.coordinates}>
                    <Typography variant="h6" style={{ marginBottom: '8px' }}>
                        Air Quality Index: {airPollutionData.aqi}
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ fontSize: '0.875rem' }}
                    >
                        CO: {airPollutionData.components.co.toFixed(2)} μg/m³
                        <br />
                        NO: {airPollutionData.components.no.toFixed(2)} μg/m³
                        <br />
                        NO₂: {airPollutionData.components.no2.toFixed(2)} μg/m³
                        <br />
                        O₃: {airPollutionData.components.o3.toFixed(2)} μg/m³
                        <br />
                        SO₂: {airPollutionData.components.so2.toFixed(2)} μg/m³
                        <br />
                        PM2.5: {airPollutionData.components.pm2_5.toFixed(
                            2
                        )}{' '}
                        μg/m³
                        <br />
                        PM10: {airPollutionData.components.pm10.toFixed(2)}{' '}
                        μg/m³
                        <br />
                        NH₃: {airPollutionData.components.nh3.toFixed(2)} μg/m³
                    </Typography>
                </div>
            )}
        </div>
    )
}

export default CityDetails
