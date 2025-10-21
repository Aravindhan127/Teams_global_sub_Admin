import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Grid, IconButton, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import { CleaveNumberInput } from "src/@core/components/cleave-components";

const validationSchema = yup.object().shape({
    size: yup.string().trim().required('size is required'),
    length: yup
        .number('Must be positive number only')
        .positive('Must be positive number only')
        .typeError('Must be positive number only')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .default(0) // Set a default value to avoid unnecessary nullable logic
        .required('Length is Required'),
    width: yup
        .number('Must be positive number only')
        .positive('Must be positive number only')
        .typeError('Must be positive number only')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .default(0) // Set a default value to avoid unnecessary nullable logic
        .required('Width is Required'),
    height: yup
        .number('Must be positive number only')
        .positive('Must be positive number only')
        .typeError('Must be positive number only')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .default(0) // Set a default value to avoid unnecessary nullable logic
        .required('Height is Required'),
})



const DialogFormSizeChart = (props) => {
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
            size: '',
            length: '',
            width: '',
            height: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })



    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Size Chart" : "Edit Size Chart");
            reset({
                size: dataToEdit?.size || '',
                length: dataToEdit?.dimensions?.length || '',
                width: dataToEdit?.dimensions?.width || '',
                height: dataToEdit?.dimensions?.height || '',
            });
        }
    }, [dataToEdit, mode, open, reset]);




    const onSubmit = (data) => {
        let payload = {
            size: data.size,
            dimensions: {
                length: data.length,
                width: data.width,
                height: data.height
            }
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.SIZE_CHART.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.SIZE_CHART.create, payload, {
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
                <form id="hub-address-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='size' error={Boolean(errors.size)}>Size</FormLabel>
                                <Controller
                                    name="size"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Size'
                                            onChange={onChange}
                                            id='size'
                                            value={value}
                                            error={Boolean(errors.size)}
                                        />
                                    }
                                />
                                {errors.size && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.size.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='length' error={Boolean(errors.length)}>Length</FormLabel>
                                <Controller
                                    name="length"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter length'
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='length'
                                            value={value}
                                            error={Boolean(errors.length)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.length && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.length.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='width' error={Boolean(errors.width)}>Width</FormLabel>
                                <Controller
                                    name="width"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter width'
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='width'
                                            value={value}
                                            error={Boolean(errors.width)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.width && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.width.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='height' error={Boolean(errors.height)}>Height</FormLabel>
                                <Controller
                                    name="height"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter height'
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='height'
                                            value={value}
                                            error={Boolean(errors.height)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.height && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.height.message}
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
                    form="hub-address-form"
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

export default DialogFormSizeChart