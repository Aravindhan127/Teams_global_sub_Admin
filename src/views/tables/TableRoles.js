import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
// import EditIcon from '../../assets/editIcon.svg'
// import DeleteIcon from '../../assets/deleteIcon.svg'
import { useNavigate } from 'react-router-dom'
import CustomDataGrid from 'src/@core/components/data-grid'
import useCustomTranslation from 'src/@core/hooks/useCustomTranslation'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function TableRoles({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleDelete,
    rolePremission,
    isMasterAdmin
}) {
    const navigate = useNavigate()
    const translation = useCustomTranslation()
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.roleId, // Add `id` for compatibility with CustomDataGrid
        index: index + 1,
        permissionName: row?.rolePermissions?.map(
            (permission) => permission.Permission?.permissionName
        ) || []
    }));
    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'role.edit') || isMasterAdmin === true;

    return (
        <CustomDataGrid
            loading={loading}
            rowCount={totalCount}
            rows={mappedRows}
            // checkboxSelection={true}
            columns={[
                {
                    field: 'id',
                    minWidth: 150,
                    sortable: true,
                    headerName: 'Role ID',
                    renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row.index}>
                        {row?.index}
                    </Typography>
                },
                {
                    field: 'roleName',
                    minWidth: 200,
                    sortable: true,
                    headerName: translation.translate('User Role'),
                    renderCell: ({ row }) => (
                        <>
                            <Typography noWrap variant='body2' textTransform='capitalize' title={row?.roleName}>
                                {row?.roleName ? row?.roleName : '-'}
                            </Typography>
                        </>
                    )
                },
                {
                    field: 'permissionName',
                    sortable: true,
                    minWidth: 600,
                    headerName: 'Can Access',
                    renderCell: ({ row }) => {
                        // Extract the permission names from the rolePermissions array
                        const permissionNames = row?.rolePermissions?.map(
                            (permission) => permission.Permission?.permissionName
                        ) || [];


                        return (
                            <Typography
                                noWrap
                                variant="body2"
                                textTransform="capitalize"
                                title={permissionNames.join(', ')} // Tooltip to show full permissions
                            >
                                {permissionNames.join(', ') || 'No Permissions'} {/* Fallback for empty permissions */}
                            </Typography>
                        );
                    },
                },
                ...(hasEditPermission
                    ? [
                        {
                            field: 'Actions',
                            minWidth: 100,
                            sortable: true,
                            headerName: translation.translate('Actions'),
                            renderCell: ({ row }) => (
                                <Box display='flex' alignItems='center' gap='5px'>
                                    <IconButton
                                        size='small'
                                        color='primary'
                                        variant='outlined'
                                        onClick={() => navigate(`/edit-roles/${row?.roleId}`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size='small' color='secondary' onClick={e => toggleDelete(e, row)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            )
                        }]
                    : [])
            ]}
            currentPage={currentPage}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
        />
    )
}

export default TableRoles
