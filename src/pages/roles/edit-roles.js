import {
    Box,
    Typography,
    TextField,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    FormControlLabel,
    Checkbox,
    TableCell,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Tooltip,
    Card
} from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import useCustomTranslation from 'src/@core/hooks/useCustomTranslation'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Controller, useForm } from 'react-hook-form'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { toastSuccess, toastError } from 'src/utils/utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// import { useAppTitle } from 'src/context/AppTitleContext'
import { InformationOutline } from 'mdi-material-ui'
import PageHeader from 'src/@core/components/page-header'

const validationSchema = yup.object().shape({
    roleName: yup.string().required('User role is required'),
    description: yup.string().required('Role Description is required')
})

function EditUserRolePage() {
    const [loading, setLoading] = useState(false)
    const params = useParams()
    const { roleId } = params
    console.log("roleid", roleId)
    const translation = useCustomTranslation()
    const [open, setOpen] = useState(false)
    const [selectAll, setSelectAll] = useState(false);
    const [rolesData, setRolesData] = useState([])
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([])

    const [permissionsData, setPermissionData] = useState([])
    const location = useLocation()
    const dataToEdit = location.state?.dataToEdit
    // const { setTitle } = useAppTitle()
    const navigate = useNavigate()

    // useEffect(() => {
    //   setTitle('Edit User Role')
    // }, [setTitle])
    const toggleDialog = () => {
        setOpen(prev => !prev)
    }

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            roleName: '',
            description: '',
            permissionIds: []
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })


    const fetchData = async () => {
        try {
            setLoading(true); // Ensure loading state is set before making the API call
            const response = await axiosInstance.get(ApiEndPoints.ROLES.roleById(roleId));

            if (response) {
                console.log("response", response?.data?.data);
                setRolesData(response.data?.data);
                setPermissionData(response?.data?.permissions);
            } else {
                console.error("Unexpected API response structure", response);
            }
        } catch (error) {
            console.error("Error fetching role data:", error);
            // toastError(error); // Uncomment if you want to show an error notification
        } finally {
            setLoading(false); // Ensure loading state is reset
        }
    };

    useEffect(() => {
        fetchData()
    }, [roleId])


    // const handleCheckboxChange = (permissionId) => {
    //     setSelectedPermissionIds((prevSelected) => {
    //         if (prevSelected.includes(permissionId)) {
    //             return prevSelected.filter((id) => id !== permissionId);
    //         } else {
    //             return [...prevSelected, permissionId];
    //         }
    //     });
    // };

    // Pre-populate on edit time
    useEffect(() => {
        if (permissionsData) {
            const preselectedIds = permissionsData
                .filter((perm) => perm.isAddedPermission)
                .map((perm) => perm.permissionId);

            setSelectedPermissionIds(preselectedIds);
        }
    }, [permissionsData]);

    const handleSelectAllChange = () => {
        if (selectAll) {
            // Deselect all
            setSelectedPermissionIds([]);
        } else {
            // Select all permissions
            const allIds = permissionsData.map((perm) => perm.permissionId);
            setSelectedPermissionIds(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleCheckboxChange = (permissionId) => {
        setSelectedPermissionIds((prevSelected) => {
            if (prevSelected.includes(permissionId)) {
                return prevSelected.filter((id) => id !== permissionId);
            } else {
                return [...prevSelected, permissionId];
            }
        });
    };

    useEffect(() => {
        if (
            permissionsData.length > 0 &&
            selectedPermissionIds.length === permissionsData.length
        ) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedPermissionIds, permissionsData]);

    const onSubmit = data => {
        let payload = {
            roleId: roleId,
            roleName: data.roleName,
            description: data.description,
            permissionIds: selectedPermissionIds
        }
        setLoading(true)
        axiosInstance
            .post(ApiEndPoints.ROLES.editRolesPermission, payload)
            .then(response => {
                console.log("res", response)
                toastSuccess(response.data?.message);
                navigate('/roles')
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        reset({
            roleName: rolesData?.roleName || '',
            description: rolesData?.description || '',
            permissionIds: permissionsData
                ?.filter((perm) => perm.isAddedPermission)
                ?.map((perm) => perm.permissionId) || [],
        })
    }, [rolesData, permissionsData, reset])

    const permissions = watch('permission')

    // const allChecked = permissionsData.every(perm => {
    //     const permValues = permissions[perm?.permissionId] || {}

    // })
    console.log("permissionsData", permissionsData)
    return (
        <>
            <Grid container spacing={4}>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            <Translations text='Edit Role' />
                        </Typography>
                    }
                />
                <Grid item xs={12}>
                    <form id="form" onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <Box sx={{ p: 5 }}>
                                <Box display='flex' flexDirection='column' pb={3}>
                                    <Typography variant='fm-p1' color='neutral.80' fontWeight={600}>
                                        <Translations text='General Information*' />
                                    </Typography>
                                    <Typography variant='fm-p2' color='neutral.80' fontWeight={400}>
                                        <Translations text='Please provide necessary information below.' />
                                    </Typography>
                                </Box>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <FormLabel htmlFor='roleName'>Role Name</FormLabel>
                                            <Controller
                                                name='roleName'
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <TextField
                                                        value={value}
                                                        onChange={onChange}
                                                        placeholder="Enter Role Name"
                                                    />
                                                )}
                                            />
                                            {errors.roleName && (
                                                <FormHelperText sx={{ color: 'error.main' }}>
                                                    <Translations text={`${errors.roleName.message}`} />
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <FormLabel htmlFor='description'>Role Description</FormLabel>
                                            <Controller
                                                name='description'
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <TextField
                                                        value={value}
                                                        onChange={onChange}
                                                        placeholder="Enter Role Name"
                                                    />
                                                )}
                                            />
                                            {errors.description && (
                                                <FormHelperText sx={{ color: 'error.main' }}>
                                                    <Translations text={`${errors.description.message}`} />
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box display='flex' flexDirection='column' sx={{ pt: 5 }}>
                                    <Typography variant='fm-p1' color='neutral.80' fontWeight={600}>
                                        <Translations text='Manage Access*' />
                                    </Typography>
                                    <Typography variant='fm-p2' color='neutral.80' fontWeight={400}>
                                        <Translations text='Please select the services which can be accessible by this user role.' />
                                    </Typography>
                                </Box>
                                <Grid container spacing={2} p={5}>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ pl: '0 !important' }}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                fontSize: '0.875rem',
                                                                alignItems: 'center',
                                                                textTransform: 'capitalize'
                                                            }}
                                                        >
                                                            Administrator Access
                                                            <Tooltip placement='top' title='Allows full access to the system'>
                                                                <InformationOutline sx={{ ml: 1, fontSize: '1rem' }} />
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell colSpan={10}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    size='small'
                                                                    // indeterminate={!allChecked && Object.keys(permissions).length > 0}
                                                                    checked={selectAll}
                                                                    onChange={handleSelectAllChange}
                                                                />
                                                            }
                                                            label='Select All'
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {permissionsData?.map((perm, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={600}
                                                                textTransform="capitalize"
                                                            >
                                                                {perm.permissionName}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Controller
                                                                name={`permission.${perm.permissionId}.read`}
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={selectedPermissionIds.includes(perm.permissionId)}
                                                                                onChange={() => handleCheckboxChange(perm.permissionId)}
                                                                                color="primary"
                                                                            />
                                                                        }
                                                                        label={perm.description}
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {errors.services && (
                                        <FormHelperText sx={{ color: 'error.main', mt: 2 }}>{errors.services.message}</FormHelperText>
                                    )}
                                </Grid>
                                <Box display='flex' alignItems='start' justifyContent='start' gap={2}>
                                    <LoadingButton
                                        onClick={() => navigate('/roles')}
                                        size='large'
                                        type='submit'
                                        variant='outlined'
                                        sx={{
                                            border: '1px solid #474747',
                                            borderRadius: '10px',
                                            height: '55px',
                                            color: '#474747 !important',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            backgroundColor: 'background.paper'
                                        }}
                                    >
                                        <Translations text='Cancel' />
                                    </LoadingButton>
                                    <LoadingButton
                                        sx={{
                                            height: '55px',
                                            textTransform: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontSize: '14px'
                                        }}
                                        form="form"
                                        type='submit'
                                        variant='contained'
                                        loading={loading}
                                    >
                                        <Translations text='Update' />
                                    </LoadingButton>
                                </Box>
                            </Box>
                        </Card>
                    </form>
                </Grid>
            </Grid>
        </>
    )
}

export default EditUserRolePage