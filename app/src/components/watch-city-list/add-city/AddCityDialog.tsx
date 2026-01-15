import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'

const AddCityDialog = ({
    open,
    handleClose,
    handleSubmit,
}: {
    open: boolean
    handleClose: () => void
    handleSubmit: (cityName: string) => void
}) => {
    const [cityName, setCityName] = useState('')
    const MAX_LENGTH = 50

    useEffect(() => {
        if (!open) {
            setCityName('')
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value.length <= MAX_LENGTH) {
            setCityName(value)
        }
    }

    const handleSubmitClick = () => {
        if (cityName.trim()) {
            handleSubmit(cityName)
        }
    }

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && cityName.trim()) {
            handleSubmit(cityName)
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Add City</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="City Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    placeholder="The newly created city will start with 0 filter wear."
                    value={cityName}
                    onChange={handleChange}
                    onKeyDown={handleEnterKey}
                    helperText={`${cityName.length}/${MAX_LENGTH}`}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmitClick}
                    variant="contained"
                    disabled={!cityName.trim()}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddCityDialog
