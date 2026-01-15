import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Outlet, Link, useLocation } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import type { WatchCity } from './watch-list-types'
import type { CSSProperties } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import AddCityContainer from './add-city/AddCityContainer'

const styles: Record<string, CSSProperties> = {
    container: {
        display: 'flex',
        height: '100vh',
    },
    listContainer: {
        width: '40%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        position: 'relative',
    },
    outletContainer: {
        width: '60%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
}

const getChipColour = (filterWear: number): 'success' | 'warning' | 'error' => {
    if (filterWear >= 81) {
        return 'error'
    } else if (filterWear >= 51 && filterWear <= 80) {
        return 'warning'
    }
    return 'success'
}

const getBarColour = (filterWear: number): string => {
    if (filterWear >= 81) {
        return '#f44336'
    } else if (filterWear >= 51 && filterWear <= 80) {
        return '#ff9800'
    }
    return '#4caf50'
}

const getLinearProgressSx = (barColor: string): SxProps<Theme> => ({
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    '& .MuiLinearProgress-bar': {
        borderRadius: 4,
        backgroundColor: barColor,
    },
})

const sxStyles: Record<string, SxProps<Theme>> = {
    dataGrid: {
        borderRadius: 0,
        '& *': {
            borderRadius: '0 !important',
        },
        '& .MuiDataGrid-columnHeader[data-field="filterWear"]': {
            justifyContent: 'center',
        },
    },
    filterWearCell: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
    },
    chip: {
        minWidth: '40px',
    },
    defaultMessageBox: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        color: '#ffffff',
    },
}

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'City Name',
        flex: 0.4,
        renderCell: params => (
            <Link
                to={`/watch-list/${params.row.id}`}
                data-testid={`city-name-link-${params.row.id}`}
            >
                {params.value}
            </Link>
        ),
    },
    {
        field: 'filterWear',
        headerName: 'Filter Wear',
        flex: 0.6,
        headerAlign: 'center',
        renderCell: params => {
            const remainingLife = 100 - params.value
            const filterWear = params.value
            const barColor = getBarColour(filterWear)
            const chipColor = getChipColour(filterWear)

            return (
                <Box
                    sx={sxStyles.filterWearCell}
                    data-testid={`filter-wear-cell-${params.row.id}`}
                >
                    <Chip
                        label={remainingLife}
                        color={chipColor}
                        size="small"
                        sx={sxStyles.chip}
                    />
                    <LinearProgress
                        variant="determinate"
                        value={remainingLife}
                        sx={getLinearProgressSx(barColor)}
                    />
                </Box>
            )
        },
    },
]

const WatchCityList = ({ cities }: { cities: WatchCity[] }) => {
    const location = useLocation()
    const hasCitySelected = location.pathname !== '/watch-list/'

    return (
        <div style={styles.container}>
            <div style={styles.listContainer}>
                <DataGrid
                    rows={cities}
                    columns={columns}
                    sx={sxStyles.dataGrid}
                />
                <AddCityContainer />
            </div>
            <div style={styles.outletContainer}>
                {hasCitySelected ? (
                    <Outlet />
                ) : (
                    <Box sx={sxStyles.defaultMessageBox}>
                        <Typography variant="h5">
                            Please select a city to see details
                        </Typography>
                    </Box>
                )}
            </div>
        </div>
    )
}

export default WatchCityList
