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
import { CleaveNumberInput, TextOnlyInput } from "src/@core/components/cleave-components";

const validationSchema = yup.object().shape({
    userEmail: yup
        .string()
        .required("Email is required")
        .max(50, "The email should have at most 50 characters")
        .matches(
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Email address must be a valid address"
        ),
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    roleId: yup.string().trim().required('Role Id is required'),
})

const DialogAdmin = (props) => {
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
            userEmail: '',
            firstName: '',
            lastName: '',
            roleId: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Add App Admin" : "Edit App Admin");
            reset({
                userEmail: dataToEdit?.userEmail || '',
                firstName: dataToEdit?.firstName || '',
                lastName: dataToEdit?.lastName || '',
                roleId: dataToEdit?.roleId || '',
                ...(mode === "edit" && { orgAdminId: dataToEdit?.orgAdminId || '' })
                // if (mode === "edit") {
                //    'orgAdminId', dataToEdit.orgAdminId;
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
        payload.append('firstName', data.firstName);
        payload.append('lastName', data.lastName);
        payload.append('userEmail', data.userEmail);
        payload.append('roleId', data.roleId);
        if (mode === "edit") {
            payload.append('orgAdminId', data.orgAdminId);
        }

        setLoading(true);
        let apiInstance = null;
        if (mode === "edit") {
            apiInstance = axiosInstance
                .post(ApiEndPoints.ADMIN.edit, payload)
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.ADMIN.create, payload)
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
                                <FormLabel htmlFor='userEmail' error={Boolean(errors.userEmail)}>User Email</FormLabel>
                                <Controller
                                    name='userEmail'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="userEmail"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter User Email'
                                            error={Boolean(errors.userEmail)}

                                        />
                                    )}
                                />

                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='firstName' error={Boolean(errors.firstName)}>First Name</FormLabel>
                                <Controller
                                    name='firstName'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="firstName"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter First Name'
                                            error={Boolean(errors.firstName)}
                                            InputProps={{
                                                inputComponent: TextOnlyInput
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='lastName' error={Boolean(errors.lastName)}>Last Name</FormLabel>
                                <Controller
                                    name='lastName'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="lastName"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter First Name'
                                            error={Boolean(errors.lastName)}
                                            InputProps={{
                                                inputComponent: TextOnlyInput
                                            }}
                                        />
                                    )}
                                />

                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='roleId' error={Boolean(errors.roleId)}>Role</FormLabel>
                                <Controller
                                    name='roleId'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            displayEmpty
                                            labelId="roleId-select-label"
                                            id="roleId-select"
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Select Role Id"
                                            error={Boolean(errors.roleId)}
                                        >
                                            <MenuItem key={''} value={''} disabled>
                                                <Typography variant='subtitle1' color={"#3a354169"}>Select Role</Typography>
                                            </MenuItem>
                                            {role.map((item) => (
                                                <MenuItem key={item?.roleId} value={item?.roleId}>
                                                    {item?.roleName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />

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

export default DialogAdmin
