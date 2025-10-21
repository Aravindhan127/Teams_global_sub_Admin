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
import { useNavigate } from 'react-router-dom'
import useCustomTranslation from 'src/@core/hooks/useCustomTranslation'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Controller, useForm } from 'react-hook-form'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { toastError, toastSuccess } from "src/utils/utils";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// import { useAppTitle } from 'src/context/AppTitleContext'
import { InformationOutline } from 'mdi-material-ui'
import PageHeader from 'src/@core/components/page-header'

const validationSchema = yup.object().shape({
    roleName: yup.string().required('User role is required'),
    description: yup.string().required('Role Description is required')
})

function AddUserRolePage() {
    const [loading, setLoading] = useState(false)
    const translation = useCustomTranslation()
    const [open, setOpen] = useState(false)
    const [permissionsData, setPermissionsData] = useState([])
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([])
    const [selectAll, setSelectAll] = useState(false);
    // const { setTitle } = useAppTitle()
    // useEffect(() => {
    //     setTitle('Add New User Role')
    // }, [setTitle])
    const toggleDialog = () => {
        setOpen(prev => !prev)
    }

    const {
        control,
        handleSubmit,
        setValue,
        watch,
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

    const navigate = useNavigate()

    const fetchPermissionData = () => {
        axiosInstance
            .get(ApiEndPoints.PERMISSION.getPermissions + `?type='all'`)
            .then(response => {
                setPermissionsData(response.data.data.permissions)
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        fetchPermissionData()
    }, [])

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
        setSelectedPermissionIds((prevIds) => {
            if (prevIds.includes(permissionId)) {
                return prevIds.filter(id => id !== permissionId) // Deselect
            } else {
                return [...prevIds, permissionId] // Select
            }
        })
    }

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
            roleName: data.roleName,
            description: data.description,
            permissionIds: selectedPermissionIds
        }
        console.log("payload", payload)
        setLoading(true)
        axiosInstance
            .post(ApiEndPoints.ROLES.addRolesPermission, payload)
            .then(response => {
                console.log("response", response)
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
    const permissions = watch('permission')

    // const allChecked = permissionsData.every(perm => {
    //     const permValues = permissions[perm.id] || {}
    //     return permValues.read && permValues.write && permValues.add && permValues.remove
    // })

    return (
        <>
            <Grid container spacing={4}>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            Add Roles
                        </Typography>
                    }
                />
                <Grid item xs={12}>
                    <form id="form" onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <Box sx={{ p: 5 }}>
                                <Box display='flex' flexDirection='column' pb={3}>
                                    <Typography variant='fm-p1' color='neutral.80' fontWeight={600}>
                                        General Information
                                    </Typography>
                                    <Typography variant='fm-p2' color='neutral.80' fontWeight={400}>
                                        Please provide necessary information below.
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
                                                        placeholder="Enter Role Description"
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
                                                            <Typography variant='body2' fontWeight={600} textTransform='capitalize'>
                                                                {perm.permissionName}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Controller
                                                                name={`permission.${perm.permissionId}.read`}
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <FormControlLabel
                                                                        control={<Checkbox size='small'
                                                                            checked={selectedPermissionIds.includes(perm.permissionId) || false}
                                                                            onChange={() => handleCheckboxChange(perm.permissionId)}
                                                                        />}
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
                                        <Translations text='Add' />
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

export default AddUserRolePage