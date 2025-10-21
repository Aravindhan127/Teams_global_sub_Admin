import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormLabel, FormControl, FormHelperText, IconButton, CircularProgress } from '@mui/material';
import FileTypeDisplay from './FileTypeDisplay';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from "mdi-material-ui/Close";
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { MEDIA_URL } from 'src/network/endpoints';

const statusColors = {
    approved: '#66bb6a', // green
    pending: '#FFB400', // yellow
    rejected: 'red'
};

const CustomChip = styled(Chip)(({ label }) => ({
    backgroundColor: statusColors[label] || statusColors.default,
    textTransform: 'capitalize',
    color: '#fff',
    width: '100px',
}));

const validationSchema = yup.object().shape({
    // title: yup.string().trim().required('Title is required')
});

const FileCard = ({ title, url, handleVerifyDocument, handleUnVerifyDocument, name, label, btn, loading }) => {
    const { control, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [reason, setReason] = useState('');

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleRejected = () => {
        handleUnVerifyDocument(name, reason);
        handleCloseDialog();
    };

    return (
        <Grid item xs={12} md={3} sm={6}>
            <Card variant="outlined" sx={{ minHeight: '300px', position: 'relative' }}>
                <CardContent>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 1 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant='h6'>{title}</Typography>
                        <CustomChip label={label} />
                    </Box>
                    <Box sx={{ minHeight: '150px', mt: '20px' }}>
                        <Box sx={{ display: 'flex', gap: 10, justifyContent: "center" }}>
                            {url?.slice(0, 2).map((url, index) => (
                                <FileTypeDisplay key={index} url={url} />
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 10, justifyContent: "center", mt: '10px' }}>
                            {url?.slice(2).map((url, index) => (
                                <FileTypeDisplay key={index} url={url} />
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: "center", mt: '20px' }}>
                        <Button
                            variant='outlined'
                            size='small'
                            onClick={() => handleVerifyDocument(name)}
                            sx={{ minWidth: '100px' }}
                            disabled={btn === 'approved'}
                            color='success'
                        >
                            Approve
                        </Button>
                        <Button
                            variant='outlined'
                            size='small'
                            onClick={handleOpenDialog}
                            sx={{ minWidth: '100px' }}
                            disabled={btn === 'rejected'}
                            color='error'
                        >
                            Reject
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            <Dialog open={dialogOpen} fullWidth maxWidth='sm' scroll='paper'>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>Reason for Rejection</Box>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <FormLabel htmlFor='reason' error={Boolean(errors.reason)}>
                            Reason
                        </FormLabel>
                        <Controller
                            name='reason'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    multiline
                                    rows={4}
                                    type="text"
                                    value={value}
                                    autoComplete='off'
                                    onChange={(e) => setReason(e.target.value)}
                                    error={Boolean(errors.reason)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                        {errors.rejectedReason && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.rejectedReason.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRejected}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default FileCard;
