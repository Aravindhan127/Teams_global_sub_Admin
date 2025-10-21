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

const DialogViewContactInfo = props => {
    const { open, toggle, dataToEdit } = props
    return (
        <>
            <Dialog open={open} fullWidth maxWidth='md' scroll='paper'>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>Contact Info</Box>
                    <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant='fm-p2' sx={{ fontWeight: 500 }}>
                                    Name:
                                </Typography>
                                <Typography variant='fm-p2' textTransform={'capitalize'}>
                                    {dataToEdit?.full_name || '-'}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant='fm-p2' sx={{ fontWeight: 500 }}>
                                    Email:
                                </Typography>
                                <Typography variant='fm-p2' textTransform={'capitalize'}>
                                    {dataToEdit?.email || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant='fm-p2' sx={{ fontWeight: 500 }}>
                                    Message:
                                </Typography>
                                <Typography variant='fm-p2' textTransform={'capitalize'}>
                                    {dataToEdit?.message || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant='fm-p2' sx={{ fontWeight: 500 }}>
                                    Phone Number:
                                </Typography>
                                <Typography variant='fm-p2' textTransform={'capitalize'}>
                                    {dataToEdit?.phone_number || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant='fm-p2' sx={{ fontWeight: 500 }}>
                                    Admin Reply:
                                </Typography>
                                <Typography variant='fm-p2' textTransform={'capitalize'}>
                                    {dataToEdit?.replyContent || 'Not Replied Yet'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DialogViewContactInfo
