import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Grid, IconButton, MenuItem, Select, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import { CleaveNumberInput } from "src/@core/components/cleave-components";
import { useParams } from "react-router-dom";

const validationSchema = yup.object().shape({
    name: yup.string().trim().required('name is required'),
    deptId: yup.string().trim().required('department is required'),
})

const DialogDegree = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess, departmentData } = props;

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
            deptId: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Add Degree" : "Edit Degree");
            reset({
                name: dataToEdit?.degreeName || '',
                deptId: dataToEdit?.deptId || '',
            });
        }
        // if (dataToEdit?.Degree) {
        //     getStateList()
        // }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {
        console.log("data", data)
        let payload = {
            name: data.name,
            deptId: data.deptId,
            ...(mode === "edit" && { degreeId: dataToEdit.degreeId })
        }
        setLoading(true);
        let apiInstance = null;
        if (mode === "edit") {
            apiInstance = axiosInstance
                .post(ApiEndPoints.DEGREE.edit, payload)
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.DEGREE.create, payload)
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
    console.log("degree dataToEdit", dataToEdit)
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
                                <FormLabel htmlFor='deptId'>Department Name</FormLabel>
                                <Controller
                                    name='deptId'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            id="deptId"
                                            value={value || ""}
                                            onChange={onChange}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (!selected) {
                                                    return <span style={{ color: '#aaa' }}>Enter Department Name</span>;
                                                }
                                                const selectedDept = departmentData.find(dept => dept.deptId === selected);
                                                return selectedDept?.deptName || '';
                                            }}
                                        >

                                            {departmentData.map((dept) => (
                                                <MenuItem key={dept.deptId} value={dept.deptId}>
                                                    {dept.deptName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.deptId && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.deptId.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='name'>Degree Name</FormLabel>
                                <Controller
                                    name='name'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="name"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter Degree Name'
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

export default DialogDegree
