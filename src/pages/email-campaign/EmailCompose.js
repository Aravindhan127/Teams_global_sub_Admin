import { MenuItem, Select, TextField, Button, Checkbox, Autocomplete, FormControlLabel, Typography, Grid, FormControl, FormHelperText, FormLabel, Box } from "@mui/material";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { DefaultPaginationSettings } from "src/constants/general.const";

const validationSchema = yup.object().shape({
    listType: yup.string().required('List type is required'),
    notificationType: yup.string().required('Notification type is required'),
    content: yup.string()
        .required('Content is required')
        .test('content-length', 'Content length exceeds limit', function (value) {
            const { notificationType } = this.parent;
            if (!value) return true;
            const wordCount = value.trim().split(/\s+/).length;
            return notificationType === 'mailCampaign' ? wordCount <= 4000 : wordCount <= 200;
        }),
});


const EmailCompose = () => {
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
    const location = useLocation()
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);
    const [departmentData, setDepartmentData] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState('')
    const [selectedDegree, setSelectedDegree] = useState('')
    const [selectedDate, setSelectedDate] = useState(null)
    const [degreeData, setDegreeData] = useState([])
    const [senderData, setSenderData] = useState([])
    const { user } = useAuth();
    const userType = user?.orgDetails?.orgType;

    const MenuOptions = userType === 'college' ? [
        { name: "All", value: "all" },
        { name: "Student", value: "student" },
        { name: "Faculty", value: "faculty" },
        { name: "Alumni", value: "alum" },
        { name: "Selected Users", value: "selected" }
    ] : [
        { name: "All", value: "all" },
        { name: "Selected Users", value: "selected" }
    ];

    const fetchSenderData = () => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize
        }
        if (search) {
            params.search = search;
        }
        if (selectedDegree) {
            params.degreeId = selectedDegree;
        }
        if (selectedDepartment) {
            params.deptId = selectedDepartment;
        }
        if (selectedDate) {
            params.passoutYear = selectedDate;
        }
        axiosInstance
            .get(ApiEndPoints?.EMAIL_CAMPAIGN?.getSenderData, { params }
            )
            .then((response) => {
                console.log("sender data response--------------------", response?.data.data);
                setSenderData(response?.data.data);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchDepartmentData = () => {
        setLoading(true);

        axiosInstance
            .get(ApiEndPoints.DEPARTMENT.get)
            .then((response) => {
                setDepartmentData(response?.data?.data?.departments);
                // setDeptId(response?.data?.data?.departments[0]?.deptId)

                console.log("Department_List response--------------------", response?.data.data.departments);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchDegreeData = () => {
        setLoading(true);

        axiosInstance
            .get(ApiEndPoints.DEGREE.get)
            .then((response) => {
                setDegreeData(response?.data?.data?.degreesList);
                console.log("Degree_List response--------------------", response?.data.data.degreesList);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };



    useEffect(() => {
        fetchDepartmentData();
        fetchDegreeData();
        fetchSenderData();
    }, [selectedDegree, selectedDepartment, selectedDate, currentPage, pageSize, search]);

    const onSubmit = (data) => {
        let payload = new FormData();
        payload.append('listType', data.listType);
        payload.append('notificationType', data.notificationType);
        if (data?.subject) payload.append("subject", data.subject);
        if (data?.content) payload.append("content", data.content);
        if (selectedDepartment) payload.append("deptId", selectedDepartment);
        if (selectedDegree) payload.append("degreeId", selectedDegree);
        if (selectedDate) payload.append("passoutYear", selectedDate);

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
                navigate('/email-campaign');
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
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
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>Select List Type</em>;
                                        }
                                        const selectedOption = MenuOptions.find(option => option.value === selected);
                                        return selectedOption ? selectedOption.name : selected;
                                    }}
                                >
                                    {MenuOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
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
                {userType === 'college' &&
                    <>
                        <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                            <FormLabel>Department</FormLabel>

                            <Select
                                id="deptName"
                                value={selectedDepartment}
                                onChange={(e) => { setSelectedDepartment(e.target.value) }}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Select Department</em>;
                                    }
                                    const selectedOption = departmentData.find(option => option.deptId === selected);
                                    return selectedOption ? selectedOption.deptName : selected;
                                }}
                            >
                                {departmentData.map((option) => (
                                    <MenuItem key={option.deptId} value={option.deptId}>
                                        {option.deptName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                            <FormLabel>Degree</FormLabel>

                            <Select
                                id="degreeName"
                                value={selectedDegree}
                                onChange={(e) => { setSelectedDegree(e.target.value) }}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Select Degree</em>;
                                    }
                                    const selectedOption = degreeData.find(option => option.degreeId === selected);
                                    return selectedOption ? selectedOption.degreeName : selected;
                                }}
                            >
                                {degreeData.map((option) => (
                                    <MenuItem key={option.degreeId} value={option.degreeId}>
                                        {option.degreeName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                            <FormLabel>Batch</FormLabel>
                            <DatePicker
                                selected={selectedDate ? new Date(selectedDate, 0) : null}
                                onChange={(date) => setSelectedDate(date?.getFullYear())}
                                showYearPicker
                                dateFormat="yyyy"
                                customInput={
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="yyyy"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                }
                            />
                        </Grid>
                    </>
                }
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
                                        options={senderData}
                                        getOptionLabel={(option) =>
                                            `${option.firstName} ${option.lastName}`
                                        }
                                        isOptionEqualToValue={(option, val) =>
                                            option.userSeqId === val.userSeqId
                                        }
                                        value={senderData.filter(user =>
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
                                                        {option?.appUser?.userEmail}
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
                                            inputProps={{
                                                maxLength: notificationType === 'mailCampaign' ? 4000 : 200
                                            }}
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
                                            {field.value?.length || 0}/{notificationType === 'mailCampaign' ? '4000' : '200'}
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
                <Grid item xs={12} sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
                    <LoadingButton
                        size="large"
                        type="submit"
                        form="form"
                        variant="contained"
                        loading={loading}
                    >
                        Compose
                    </LoadingButton>
                    <Button size="large" variant="outlined" onClick={() => navigate('/email-campaign')}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}
export default EmailCompose;       