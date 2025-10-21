import { Box, IconButton } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import CustomDataGrid from 'src/@core/components/data-grid'
import useCustomTranslation from 'src/@core/hooks/useCustomTranslation'
import EditIcon from '@mui/icons-material/Edit'

function TablePermission({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleDelete
}) {
    const translation = useCustomTranslation()
    const navigate = useNavigate()
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.permissionId, // Add `id` for compatibility with CustomDataGrid
        index: index + 1,
    }));
    return (
        <CustomDataGrid
            loading={loading}
            rowCount={totalCount}
            rows={mappedRows}
            ID={row => row?.id}
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
                    field: 'permissionName',
                    minWidth: 200,
                    sortable: true,
                    headerName: translation.translate('Name'),
                    renderCell: ({ row }) => (
                        <>
                            <Typography noWrap variant='body2' textTransform='capitalize' title={row?.permissionName}>
                                {row?.permissionName ? row?.permissionName : '-'}
                            </Typography>
                        </>
                    )
                },
                {
                    field: 'description',
                    minWidth: 400,
                    sortable: true,
                    headerName: translation.translate('Description'),
                    renderCell: ({ row }) => (
                        <>
                            <Typography noWrap variant='body2' textTransform='capitalize' title={row?.description}>
                                {row?.description ? row?.description : '-'}
                            </Typography>
                        </>
                    )
                },
                // {
                //     field: 'permissionFor',
                //     minWidth: 150,
                //     sortable: true,
                //     headerName: translation.translate('Permission For'),
                //     renderCell: ({ row }) => (
                //         <>
                //             <Typography noWrap variant='body2' textTransform='capitalize' title={row?.permissionFor}>
                //                 {row?.permissionFor ? row?.permissionFor : '-'}
                //             </Typography>
                //         </>
                //     )
                // },
                // {
                //     field: 'Actions',
                //     flex: 0,
                //     minWidth: 100,
                //     sortable: true,
                //     headerName: translation.translate('Actions'),
                //     renderCell: ({ row }) => (
                //         <Box display='flex' alignItems='center' gap='5px'>
                //             <IconButton size='small' color='primary' variant='outlined' onClick={e => toggleEdit(e, 'edit', row)}>
                //                 <EditIcon />
                //             </IconButton>
                //         </Box>
                //     )
                // }
            ]}
            currentPage={currentPage}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
        />
    )
}

export default TablePermission
