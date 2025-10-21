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
    name: yup.string().trim().required('Please add a name.'),
    canBeDeliveredToCenter: yup.string().trim().required('Please select option can be delivered to center '),
})

const DialogFormCategory = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            canBeDeliveredToCenter: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Parcel Category" : "Edit Parcel Category");
            reset({
                name: dataToEdit?.name || '',
                canBeDeliveredToCenter: dataToEdit?.canBeDeliveredToCenter,
            });
        }
    }, [dataToEdit, mode, open, reset]);




    const onSubmit = (data) => {
        let payload = {
            name: data.name,
            canBeDeliveredToCenter: data.canBeDeliveredToCenter,
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.PARCEL_CATEGORY.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.PARCEL_CATEGORY.create, payload, {
                })
        }
        apiInstance
            .then((response) => response.data)
            .then((response) => {
                onSuccess();
                toastSuccess(response.message);
                toggle();
            })
            .catch((error) => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return <>
        <Dialog open={open} fullWidth maxWidth='sm' scroll="paper">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>{dialogTitle}</Box>
                <IconButton
                    aria-label="close"
                    onClick={toggle}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="category-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='name' error={Boolean(errors.name)}>Name</FormLabel>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Name'
                                            onChange={onChange}
                                            id='name'
                                            value={value}
                                            error={Boolean(errors.name)}
                                        />
                                    }
                                />
                                {errors.name && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.name.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='canBeDeliveredToCenter' error={Boolean(errors.canBeDeliveredToCenter)}>
                                    Can Be Delivered To Center
                                </FormLabel>
                                <Controller
                                    name='canBeDeliveredToCenter'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <RadioGroup row name='canBeDeliveredToCenter' onChange={onChange} value={value}>
                                            <FormControlLabel sx={errors.canBeDeliveredToCenter ? { color: 'error.main' } : null} value={true} control={<Radio sx={errors.canBeDeliveredToCenter ? { color: 'error.main' } : null} />} label='Yes' />
                                            <FormControlLabel sx={errors.canBeDeliveredToCenter ? { color: 'error.main' } : null} value={false} control={<Radio sx={errors.canBeDeliveredToCenter ? { color: 'error.main' } : null} />} label='No' />
                                        </RadioGroup>
                                    )}
                                />
                                {errors.canBeDeliveredToCenter && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.canBeDeliveredToCenter.message}</FormHelperText>
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
                    form="category-form"
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

export default DialogFormCategory