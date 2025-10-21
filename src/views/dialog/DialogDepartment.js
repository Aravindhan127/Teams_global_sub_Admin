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
    name: yup.string().trim().required('name is required'),
})

const DialogDepartment = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;

    console.log("dataToEdit", dataToEdit);
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
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Add Department" : "Edit Department");
            reset({
                name: dataToEdit?.deptName || '',

            });
        }
        // if (dataToEdit?.Department) {
        //     getStateList()
        // }
    }, [dataToEdit, mode, open, reset]);
    const onSubmit = (data) => {
        console.log("data", data)
        let payload = {
            name: data.name,
            ...(mode === "edit" && { deptId: dataToEdit.deptId })
        }
        setLoading(true);
        let apiInstance = null;
        if (mode === "edit") {
            apiInstance = axiosInstance
                .post(ApiEndPoints.DEPARTMENT.edit, payload)
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.DEPARTMENT.create, payload)
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
                                <FormLabel htmlFor='name'>Name</FormLabel>
                                <Controller
                                    name='name'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="name"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter Name'
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.name.message}
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

export default DialogDepartment
