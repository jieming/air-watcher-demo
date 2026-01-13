import { useState } from 'react'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import AddCityDialog from './AddCityDialog'
import type { CSSProperties } from 'react'

const fabStyles: CSSProperties = {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
}

const AddCityContainer = () => {
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = (cityName: string) => {
        // TODO: Add city operation will be implemented later
        console.log('City name:', cityName)
        handleClose()
    }

    return (
        <>
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpen}
                style={fabStyles}
            >
                <AddIcon />
            </Fab>
            <AddCityDialog
                open={open}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
            />
        </>
    )
}

export default AddCityContainer
