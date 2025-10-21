import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Grid, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import { CleaveNumberInput } from "src/@core/components/cleave-components";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const validationSchema = yup.object().shape({
    location: yup.string().trim().required('Location is required'),
    yearEstablished: yup.string().trim().required('Year is required'),
    chapterName: yup.string().trim().required('Chapter Name is required'),
})

const DialogChapter = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess, role } = props;

    console.log("role", role);
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            location: '',
            yearEstablished: '',
            chapterName: '',

        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Add Chapter" : "Edit Chapter");
            reset({
                location: dataToEdit?.location || '',
                yearEstablished: dataToEdit?.yearEstablished || '',
                chapterName: dataToEdit?.chapterName || '',

                ...(mode === "edit" && { chapterId: dataToEdit?.chapterId || '' })
                // if (mode === "edit") {
                //    'chapterId', dataToEdit.chapterId;
                // }
            });
        }
        // if (dataToEdit?.Admin) {
        //     getStateList()
        // }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {
        console.log("data", data)
        let payload = new FormData();
        payload.append('location', data.location);
        payload.append('yearEstablished', data.yearEstablished);
        payload.append('chapterName', data.chapterName);

        if (mode === "edit") {
            payload.append('chapterId', data.chapterId);
        }

        setLoading(true);
        let apiInstance = null;
        if (mode === "edit") {
            apiInstance = axiosInstance
                .post(ApiEndPoints.CHAPTER.edit, payload)
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.CHAPTER.create, payload)
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
                {dialogTitle}
                <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='location'>Location</FormLabel>
                                <Controller
                                    name='location'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="location"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter Location'
                                        />
                                    )}
                                />
                                {errors.location && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.location.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='yearEstablished'>Year Established</FormLabel>
                                <Controller
                                    name='yearEstablished'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <DatePicker
                                            selected={value ? new Date(value, 0) : null}
                                            onChange={(date) => onChange(date?.getFullYear())}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            customInput={
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder="yyyy"
                                                    InputProps={{
                                                        inputComponent: CleaveNumberInput,
                                                        readOnly: true,
                                                    }}
                                                />}
                                        />
                                    )}
                                />
                                {errors.yearEstablished && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.yearEstablished.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='chapterName'>Chapter Name</FormLabel>
                                <Controller
                                    name='chapterName'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="chapterName"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter Chapter Name'
                                        />
                                    )}
                                />
                                {errors.chapterName && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.chapterName.message}
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
                    form="form"
                    variant="contained"
                    loading={loading}
                >
                    {mode === 'edit' ? 'Update' : 'Add'}
                </LoadingButton>
                <Button size="large" variant="outlined" onClick={toggle}>
                    Cancel
                </Button>
            </DialogActions>
            {/* )} */}

        </Dialog >
    </>
}

export default DialogChapter
