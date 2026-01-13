import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import AddCityDialog from './AddCityDialog'
import { CREATE_WATCH_CITY } from '../watch-list-operations'
import { GET_WATCH_CITIES } from '../watch-list-operations'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '../../../store/snackbarSlice'
import type { CSSProperties } from 'react'
import type { AppDispatch } from '../../../store/store'

const fabStyles: CSSProperties = {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
}

const AddCityContainer = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const [createWatchCity] = useMutation(CREATE_WATCH_CITY, {
        refetchQueries: [{ query: GET_WATCH_CITIES }],
        awaitRefetchQueries: true,
    })

    const handleSubmit = async (cityName: string) => {
        try {
            await createWatchCity({
                variables: {
                    name: cityName.trim(),
                    filterWear: 0,
                },
            })
            handleClose()
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to add city to watch list'
            dispatch(
                showSnackbar({
                    message: errorMessage,
                    severity: 'error',
                })
            )
        }
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
