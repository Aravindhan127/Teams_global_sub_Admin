import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, Radio, RadioGroup, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";

const validationSchema = yup.object().shape({
    rejectReason: yup.string().required("Required"),
})

const DialogRejectReason = (props) => {

    const { open, toggle, id, onSuccess, type } = props;

    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            userSeqId: id,
            rejectReason: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            reset({
                rejectReason: '',
            })

        }
    }, [open, reset])
    console.log("type", type)
    const onSubmit = (data) => {
        // Convert the value of 'status' to boolean
        let payload = {
            rejectReason: data.rejectReason,
            ...(type !== 'lounge' && { userSeqId: id }), // Exclude if type === 'lounge'
            ...(type === 'lounge' && { loungeId: id }),
            ...(type === 'lounge' && { status: 'rejected' }),
        };


        setLoading(true);
        let apiInstance = null
        if (type === 'college') {
            apiInstance = axiosInstance.post(ApiEndPoints.COLLEGE_USER.reject, payload);
        } else if (type === 'lounge') {
            apiInstance = axiosInstance.post(ApiEndPoints.LOUNGE.approve_reject, payload);
        }
        else {
            apiInstance = axiosInstance.post(ApiEndPoints.ORGANIZATION_USER.reject, payload);
        }

        apiInstance
            .then((response) => response)
            .then((response) => {
                console.log("response", response)
                onSuccess();
                toastSuccess(response?.message);
                toggle();
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return <>
        <Dialog open={open} onClose={toggle} fullWidth maxWidth='sm' scroll="paper">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>Confirm Rejection</Box>
                <IconButton
                    aria-label="close"
                    onClick={toggle}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="status-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='rejectReason'>Rejection Reason</FormLabel>
                                <Controller
                                    name="rejectReason"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Reason'
                                            onChange={onChange}
                                            id='rejectReason'
                                            value={value}
                                            error={Boolean(errors.rejectReason)}
                                        />
                                    }
                                />
                                {errors.rejectReason && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.rejectReason.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    size="large"
                    type="submit"
                    form="status-form"
                    variant="contained"
                    loading={loading}
                >
                    Submit
                </LoadingButton>
                <Button size="large" variant="outlined" onClick={toggle}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    </>
}

export default DialogRejectReason