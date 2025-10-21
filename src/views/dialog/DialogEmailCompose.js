import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, TextField, Button, Checkbox, Autocomplete, FormControlLabel, Typography, Grid, FormControl, FormHelperText, FormLabel, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { axiosInstance } from "src/network/adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApiEndPoints } from "src/network/endpoints";
import { toastSuccess, toastError } from "src/utils/utils";
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup'
import { LoadingButton } from "@mui/lab";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const validationSchema = yup.object().shape({
    listType: yup.string().required('List type is required'),
    notificationType: yup.string().required('Notification type is required'),
    // subject: yup.string().required('Subject is required').max(100, 'Subject can be max 100 characters'),
    content: yup.string().required('Content is required').max(200, 'Content can be max 200 characters'),
});

const DialogEmailCompose = ({ open, onClose, users }) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm({
        defaultValues: {
            listType: 'all',
            notificationType: '',
            content: '',
            subject: '',
            userSeqIds: [],
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const [loading, setLoading] = useState(false);
    const notificationType = watch('notificationType');
    const listType = watch('listType');

    console.log("errors", errors);
    console.log("users", users);
    // useEffect(() => {
    //     if (open) {
    //         setLoading(false);
    //         reset({
    //             listType: dataToEdit?.listType || '',
    //             notificationType: dataToEdit?.notificationType || '',
    //             content: dataToEdit?.content || "",
    //             subject: dataToEdit?.subject || "",
    //         });

    //     } else {

    //     }
    // }, [ open, reset]);


    const onSubmit = (data) => {
        let payload = new FormData();
        payload.append('listType', data.listType);
        payload.append('notificationType', data.notificationType);
        if (data?.subject) payload.append("subject", data.subject);
        if (data?.content) payload.append("content", data.content);

        if (Array.isArray(data.userSeqIds) && data.userSeqIds.length > 0) {
            data.userSeqIds.forEach((id, index) => {
                payload.append(`userSeqIds[${index}]`, id);
            });
        }

        setLoading(true);
        axiosInstance
            .post(ApiEndPoints.EMAIL_CAMPAIGN.sendMailCampaign, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((response) => {

                toastSuccess(response.data.message);
                reset();
                onClose();
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Compose Campaign Mail</DialogTitle>
            <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='listType'>Send To</FormLabel>
                                <Controller
                                    name='listType'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            id="listType"
                                            value={value}
                                            onChange={onChange}
                                            // readOnly
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>Select List Type</em>;
                                                }
                                                return selected;
                                            }}
                                        >
                                            <MenuItem value={'all'}>All</MenuItem>
                                            <MenuItem value={'student'}>Student</MenuItem>
                                            <MenuItem value={'faculty'}>Faculty</MenuItem>
                                            <MenuItem value={'alum'}>Alumni</MenuItem>
                                            <MenuItem value={'selected'}>Selected Users</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.listType && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.listType.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        {listType === 'selected' && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel>Select Users</FormLabel>
                                    <Controller
                                        name="userSeqIds"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Autocomplete
                                                multiple
                                                disableCloseOnSelect
                                                options={users}
                                                getOptionLabel={(option) =>
                                                    `${option.firstName} ${option.lastName}`
                                                }
                                                isOptionEqualToValue={(option, val) =>
                                                    option.userSeqId === val.userSeqId
                                                }
                                                value={users.filter(user =>
                                                    value.includes(user.userSeqId)
                                                )}
                                                onChange={(event, newValue) => {
                                                    const selectedIds = newValue.map(
                                                        user => user.userSeqId
                                                    );
                                                    onChange(selectedIds);
                                                }}
                                                renderOption={(props, option, { selected }) => (
                                                    <li {...props}>
                                                        <Checkbox
                                                            checked={value.includes(option.userSeqId)}
                                                            style={{ marginRight: 8 }}
                                                        />
                                                        <Box>
                                                            <div>
                                                                {option.firstName} {option.lastName} ({option.userType})
                                                            </div>
                                                            <small style={{ color: '#888' }}>
                                                                {option.appUser.userEmail}
                                                            </small>
                                                        </Box>
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Choose users"
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.userSeqIds && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.userSeqIds.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        )}


                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='notificationType'>Notification Type</FormLabel>
                                <Controller
                                    name='notificationType'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            id="notificationType"
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Select Notification Type"
                                        >
                                            <MenuItem disabled>Select Notification Type</MenuItem>
                                            <MenuItem value={'inApp'}>In App</MenuItem>
                                            <MenuItem value={'mailCampaign'}>Mail Campaign</MenuItem>
                                            <MenuItem value={'pushNotification'}>Push Notification</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.notificationType && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.notificationType.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {notificationType !== 'inApp' && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor="subject">Subject</FormLabel>
                                    <Controller
                                        name="subject"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id="subject"
                                                placeholder="Enter Subject"
                                                error={Boolean(errors.subject)}
                                            />
                                        )}
                                    />
                                    {errors.subject && (
                                        <FormHelperText sx={{ color: "error.main" }}>
                                            {errors.subject.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='content'> {notificationType === 'inApp' ? 'Message' : 'Content'}</FormLabel>
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        notificationType === 'mailCampaign' ? (
                                            <ReactQuill
                                                theme="snow"
                                                value={field.value}
                                                onChange={(value) => {
                                                    setValue('content', value, { shouldValidate: true });
                                                    field.onChange(value);
                                                }}
                                                modules={{
                                                    toolbar: [
                                                        [{ header: [1, 2, 3, false] }],
                                                        ['bold', 'italic', 'underline'],
                                                        ['blockquote'],
                                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                                        ['link'],
                                                        ['clean'],
                                                    ],
                                                }}
                                                formats={[
                                                    'header',
                                                    'bold', 'italic', 'underline',
                                                    'blockquote', 'list', 'bullet',
                                                    'link',
                                                ]}
                                            />
                                        ) : (
                                            <Box sx={{ position: "relative", width: "100%" }}>
                                                <TextField
                                                    {...field}
                                                    id="content"
                                                    placeholder={notificationType === 'inApp' ? 'Enter Message' : "Enter content"}
                                                    error={Boolean(errors.content)}
                                                    multiline
                                                    rows={5}
                                                    variant="outlined"
                                                    fullWidth
                                                    inputProps={{ maxLength: 200 }}
                                                    sx={{
                                                        "& .MuiInputBase-root": {
                                                            paddingBottom: "25px",
                                                        },
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        position: "absolute",
                                                        bottom: 8,
                                                        right: 10,
                                                        color: "gray",
                                                    }}
                                                >
                                                    {field.value?.length || 0}/200
                                                </Typography>
                                            </Box>
                                        )
                                    )}
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
                    form="form"
                    variant="contained"
                    loading={loading}
                >
                    Compose
                </LoadingButton>
                <Button size="large" variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default DialogEmailCompose;
