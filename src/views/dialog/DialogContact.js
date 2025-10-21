import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Grid, IconButton, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import { CleaveNumberInput } from "src/@core/components/cleave-components";

const validationSchema = yup.object().shape({
    content: yup.string().trim().required('content is required'),
})



const DialogContact = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;

    console.log("mode", mode);
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            full_name: '',
            email: '',
            message: '',
            phone_number: '',
            content: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Send Email" : "Send Email");
            reset({
                full_name: dataToEdit?.full_name || '',
                email: dataToEdit?.email || '',
                message: dataToEdit?.message || '',
                phone_number: dataToEdit?.phone_number || '',
                content: dataToEdit?.replyContent || '',
            });
        }
        // if (dataToEdit?.country) {
        //     getStateList()
        // }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {
        let payload = {
            content: data.content,
        }
        setLoading(true);

        let apiInstance = null;
        apiInstance = axiosInstance
            .post(ApiEndPoints.ContactUs.reply(dataToEdit._id), payload, {
            })
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
                {dialogTitle}
                <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="hub-address-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='full_name' error={Boolean(errors.name)}>Name</FormLabel>
                                <Controller
                                    name="full_name"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            disabled
                                            onChange={onChange}
                                            id='name'
                                            value={value}
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='phone_number' error={Boolean(errors.phone_number)}>Phone Number</FormLabel>
                                <Controller
                                    name="phone_number"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            disabled
                                            onChange={onChange}
                                            id='phone_number'
                                            value={value}
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            disabled
                                            onChange={onChange}
                                            id='email'
                                            value={value}
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel>User Message</FormLabel>
                                <Controller
                                    name="message"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            disabled
                                            multiline
                                            onChange={onChange}
                                            id='message'
                                            value={value}
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='content' error={Boolean(errors.address)}>Admin Reply</FormLabel>
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            multiline
                                            rows={2}
                                            onChange={onChange}
                                            id='content'
                                            value={value}
                                            error={Boolean(errors.content)}
                                        />
                                    }
                                />
                                {errors.content && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.content.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            {/* {mode !== 'view' && ( */}
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
            {/* )} */}

        </Dialog >
    </>
}

export default DialogContact
