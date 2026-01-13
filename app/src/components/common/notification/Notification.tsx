import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../store/store'
import { hideSnackbar } from '../../../store/snackbarSlice'

const Notification = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { open, message, severity } = useSelector(
        (state: RootState) => state.snackbar
    )

    const handleClose = () => {
        dispatch(hideSnackbar())
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default Notification
