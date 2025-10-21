import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

const DialogConfirmation = (props) => {

    const { open, toggle, title, subtitle, onConfirm, loading } = props;

    return <>
        <Dialog open={open} onClose={toggle} maxWidth='xs' scroll="paper">
            <DialogTitle sx={{ textAlign: 'center' }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText textAlign={'center'}>
                    {subtitle || ''}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={loading} variant="contained" fullWidth onClick={onConfirm}>
                    Yes, Confirm
                </LoadingButton>
                <Button variant="outlined" fullWidth onClick={toggle}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    </>
}

export default DialogConfirmation