import { useEffect, useState, useRef, useCallback } from 'react'
import { Button, Grid, MenuItem, Select, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import PageHeader from 'src/@core/components/page-header'
import Translations from 'src/layouts/components/Translations'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { toastError, toastSuccess } from 'src/utils/utils'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import { useNavigate } from 'react-router-dom'
import TablePermission from 'src/views/tables/TablePermission'
import DialogPermission from 'src/views/dialog/DialogPermission'

const UserPermissionPage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [permission, setPermission] = useState([])
    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [DialogMode, setDialogMode] = useState('add')
    const [dataToEdit, setDataToEdit] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setUserToDelete(dataToDelete)
    }

    const toggleDialog = (mode = 'add', vehicleToEdit = null) => {
        console.log('vehicleToEdit', vehicleToEdit)
        setIsOpen(prev => !prev)
        setDialogMode(mode)
        setDataToEdit(vehicleToEdit)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }
        axiosInstance
            .get(ApiEndPoints.PERMISSION.getPermissions, { params })
            .then(response => {
                setPermission(response.data.data.permissions)
                setTotalCount(response.data.data.total)
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search
        })
    }, [currentPage, pageSize, search])

    // const onConfirmDeleteUser = useCallback(
    //   e => {
    //     e?.preventDefault()
    //     setConfirmationDialogLoading(true)
    //     axiosInstance
    //       .delete(ApiEndPoints.USER.delete(userToDelete?.id))
    //       .then(response => response.data)
    //       .then(response => {
    //         fetchData({
    //           currentPage: currentPage,
    //           pageSize: pageSize,
    //           search: search
    //         })
    //         toggleConfirmationDialog()
    //         toastSuccess(response.message)
    //       })
    //       .catch(error => {
    //         toastError(error)
    //       })
    //       .finally(() => {
    //         setConfirmationDialogLoading(false)
    //       })
    //   },
    //   [currentPage, userToDelete, pageSize, search]
    // )

    return (
        <>
            <Grid container spacing={4}>
                <PageHeader
                // title={
                //     <Typography variant='h5'>
                //         <Translations text='Permissions' />
                //     </Typography>
                // }
                // action={
                //     <Button variant='contained' onClick={() => toggleDialog()}>
                //         <Translations text='Add Permissions' />
                //     </Button>
                // }
                />
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                        <Box sx={{ p: 5 }}>
                            <TablePermission
                                search={search}
                                loading={loading}
                                rows={permission}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={toggleDialog}
                                toggleDelete={toggleConfirmationDialog}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <DialogPermission open={isOpen} toggle={toggleDialog} mode={DialogMode} />
        </>
    )
}

export default UserPermissionPage