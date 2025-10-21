import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography
} from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import QRCode from 'react-qr-code'

const DialogQR = props => {
    const { open, toggle, dataToEdit } = props
    console.log("dataToEdit", dataToEdit);

    return (
        <>
            <Dialog open={open} fullWidth maxWidth='xs' scroll='paper'>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>Info</Box>
                    <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                    <Grid container spacing={4} >
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant='fm-p2' sx={{ fontWeight: 500 }}>
                                    Order ID
                                </Typography>
                                <Typography variant='fm-p2' textTransform={'capitalize'}>
                                    {dataToEdit?.order_ID}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {dataToEdit?._id ? (
                                <QRCode value={dataToEdit._id} size="250" />
                            ) : (
                                <Typography variant='fm-p2'>No QR code available</Typography>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DialogQR
