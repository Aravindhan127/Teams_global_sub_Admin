import * as React from 'react'
import Box from '@mui/material/Box'
import { Button, Card, Grid, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Translations from 'src/layouts/components/Translations'
import { useNavigate } from 'react-router-dom'
import { ApiEndPoints } from 'src/network/endpoints'
import { axiosInstance } from 'src/network/adapter'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { useState } from 'react'
import { toastError, toastSuccess } from 'src/utils/utils'
import { useEffect } from 'react'
import { useCallback } from 'react'
import PageHeader from 'src/@core/components/page-header'
import TableRoles from 'src/views/tables/TableRoles'
import { useAuth } from 'src/hooks/useAuth'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'

function UserRolesPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [userRoles, setUserRole] = useState([])
    const { rolePremission, isMasterAdmin } = useAuth()
    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setUserToDelete(dataToDelete)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }
        axiosInstance
            .get(ApiEndPoints.ROLES.getRoles, { params })
            .then(response => {
                console.log("res", response.data.data)
                setUserRole(response.data.data)
                setTotalCount(response.data.data.totalCount)
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

    const onConfirmDeleteUser = useCallback(
        e => {
            e?.preventDefault()
            setConfirmationDialogLoading(true)
            axiosInstance
                .delete(ApiEndPoints.ROLES.delete(userToDelete?.roleId))
                .then(response => response.data)
                .then(response => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search
                    })
                    toggleConfirmationDialog()
                    toastSuccess(response.message)
                })
                .catch(error => {
                    toastError(error)
                })
                .finally(() => {
                    setConfirmationDialogLoading(false)
                })
        },
        [currentPage, userToDelete, pageSize, search]
    )

    // return (
    //   <>
    //     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
    //       <Box
    //         sx={{
    //           backgroundColor: 'background.paper',
    //           border: '1px solid #DFDFE3',
    //           borderRadius: '10px'
    //         }}
    //         p={4}
    //       >
    //         <Box display='flex' alignItems='center' justifyContent='space-between'>
    //           <Box display='flex' flexDirection='column'>
    //             <Typography variant='fm-p1' fontWeight={600} color='neutral.80'>
    //               <Translations text='Add New User Role' />
    //             </Typography>
    //             <Typography variant='fm-p2' fontWeight={400} color='neutral.80'>
    //               <Translations text='Create new user role.' />
    //             </Typography>
    //           </Box>
    //           <LoadingButton
    //             onClick={() => navigate('/roles/add-role')}
    //             sx={{ borderRadius: '10px', height: '48px', fontWeight: 600, color: '#fff' }}
    //             size='small'
    //             type='submit'
    //             variant='contained'
    //           >
    //             <Translations text='Add User Role' />
    //           </LoadingButton>
    //         </Box>
    //       </Box>
    //       <Box sx={{ height: '60vh' }}>
    //         <Typography variant='fm-p1' fontWeight={600} color='neutral.80'>
    //           <Translations text='Roles' />
    //         </Typography>
    //         <RolesTable
    //           search={search}
    //           loading={loading}
    //           rows={userRoles}
    //           totalCount={totalCount}
    //           setCurrentPage={setCurrentPage}
    //           currentPage={currentPage}
    //           setPageSize={setPageSize}
    //           pageSize={pageSize}
    //           toggleDelete={toggleConfirmationDialog}
    //         />
    //       </Box>
    //     </Box>

    //   </>
    // )
    return (
        <>
            <Grid container spacing={4}>
                <PageHeader
                    // title={
                    //     <Typography variant='h5'>
                    //         <Translations text='Roles' />
                    //     </Typography>
                    // }
                    action={
                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'role.create'
                        ) || isMasterAdmin === true) ? (
                            <Button variant='contained' onClick={() => navigate('/add-roles')}>
                                <Translations text='Add Roles' />
                            </Button>
                        ) : null
                    }

                />
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                        <Box sx={{ p: 5 }}>
                            <TableRoles
                                search={search}
                                loading={loading}
                                rows={userRoles}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                // toggleEdit={toggleDialog}
                                toggleDelete={toggleConfirmationDialog}
                                rolePremission={rolePremission}
                                isMasterAdmin={isMasterAdmin}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <DialogConfirmation
                loading={confirmationDialogLoading}
                title="Delete User Role"
                subtitle="Are you sure you want to delete this role?"
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDeleteUser}
            />

            {/* <DialogPermission open={isOpen} toggle={toggleDialog} mode={DialogMode} /> */}
        </>
    )
}
export default UserRolesPage