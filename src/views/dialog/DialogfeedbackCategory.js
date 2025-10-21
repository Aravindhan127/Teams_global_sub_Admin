import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, Radio, RadioGroup, Rating, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import 'react-quill/dist/quill.snow.css'

const validationSchema = yup.object().shape({
    name: yup.string().trim().required('Please enter your name.').max(25, 'name must be at most 25 characters.'),
    status: yup.string().trim().required('Please select a status'),
});

const DialogfeedbackCategory = (props) => {
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
            stars: '',
            status: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    });


    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Feedback Category" : "Edit Feedback Category");

            reset({
                name: dataToEdit?.name || '',
                stars: dataToEdit?.stars || '',
                status: dataToEdit?.status || '',
            });
        }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {
        let payload = {
            name: data.name,
            stars: data.stars,
            status: data.status
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.FEEDBACK_CATEGORY.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.FEEDBACK_CATEGORY.create, payload, {
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
    return (
        <>
            <Dialog open={open} onClose={toggle} fullWidth maxWidth='sm' scroll="paper">
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
                    <form id="form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor='name' error={Boolean(errors.name)}>Title</FormLabel>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field: { value, onChange } }) =>
                                            <TextField
                                                placeholder='Enter name'
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
                                    <FormLabel required htmlFor='stars' error={Boolean(errors.stars)}>Rating</FormLabel>
                                    <Controller
                                        name="stars"
                                        control={control}
                                        render={({ field: { value, onChange } }) =>
                                            // <TextField
                                            //     placeholder='Enter name'
                                            //     onChange={onChange}
                                            //     id='name'
                                            //     value={value}
                                            //     error={Boolean(errors.name)}
                                            // />
                                            <Rating precision={0.5} id='stars' error={Boolean(errors.stars)}
                                                onChange={onChange}
                                                name="read-only" value={value} />
                                        }
                                    />
                                    {errors.stars && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.stars.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor='status' error={Boolean(errors.status)}>
                                        Status
                                    </FormLabel>
                                    <Controller
                                        name='status'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <RadioGroup row name='status' onChange={onChange} value={value}>
                                                <FormControlLabel value={'active'} control={<Radio />} label='Active' />
                                                <FormControlLabel value={'inactive'} control={<Radio />} label='Inactive' />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.status && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.status.message}
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
                        form="form"
                        variant="contained"
                        loading={loading}
                    >
                        Submit
                    </LoadingButton>
                    <Button size="large" variant="outlined" onClick={toggle}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DialogfeedbackCategory;
