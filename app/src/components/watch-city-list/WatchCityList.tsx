import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Outlet, Link } from 'react-router-dom'
import type { WatchCity } from './watch-list-types'
import type { CSSProperties } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'

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
    },
    outletContainer: {
        width: '60%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
}

const dataGridSx: SxProps<Theme> = {
    borderRadius: 0,
    '& *': {
        borderRadius: '0 !important',
    },
}

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'City Name',
        width: 200,
        flex: 1,
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
        width: 150,
        renderCell: params => (
            <span data-testid={`filter-wear-cell-${params.row.id}`}>
                {params.value}
            </span>
        ),
    },
]

const WatchCityList = ({ cities }: { cities: WatchCity[] }) => {
    return (
        <div style={styles.container}>
            <div style={styles.listContainer}>
                <DataGrid rows={cities} columns={columns} sx={dataGridSx} />
            </div>
            <div style={styles.outletContainer}>
                <Outlet />
            </div>
        </div>
    )
}

export default WatchCityList
