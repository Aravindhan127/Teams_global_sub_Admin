import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CustomDataGrid from 'src/@core/components/data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
function TablePinCode({
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
    const statusColors = {
        onTheway: '#FFB400',
        delivered: '#66bb6a',
        pending: '#FFB400',
    }
    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))
    return (
        <CustomDataGrid
            loading={loading}
            rowCount={totalCount}
            rows={rows}
            columns={[
                {
                    field: 'pincode',
                    flex: 0.1,
                    minWidth: 180,
                    sortable: false,
                    headerName: 'Pincode',
                    renderCell: ({ row }) => (
                        <Typography noWrap variant='body2' title={`${row.postcodeStart} - ${row.postcodeEnd} `}>
                            {row.postcodeStart} - {row.postcodeEnd}
                        </Typography>
                    )
                },
                // {
                //     field: 'country',
                //     flex: 0.1,
                //     minWidth: 180,
                //     sortable: false,
                //     headerName: 'Country',
                //     renderCell: ({ row }) => (
                //         <Typography noWrap variant='body2' title={row.country}>
                //             {row.country}
                //         </Typography>
                //     )
                // },
                // {
                //     field: 'state',
                //     flex: 0.1,
                //     minWidth: 180,
                //     sortable: false,
                //     headerName: 'State',
                //     renderCell: ({ row }) => (
                //         <Typography noWrap variant='body2' title={row.state}>
                //             {row.state}
                //         </Typography>
                //     )
                // },
                // {
                //     field: 'city',
                //     flex: 0.1,
                //     minWidth: 180,
                //     sortable: false,
                //     headerName: 'City',
                //     renderCell: ({ row }) => (
                //         <Typography noWrap variant='body2' title={row.city}>
                //             {row.city}
                //         </Typography>
                //     )
                // },
                // {
                //     field: 'region',
                //     flex: 0.1,
                //     minWidth: 180,
                //     sortable: false,
                //     headerName: 'Region',
                //     renderCell: ({ row }) => (
                //         <Typography noWrap variant='body2' title={row.region}>
                //             {row.region}
                //         </Typography>
                //     )
                // },
                // {
                //     field: 'currency',
                //     flex: 0.1,
                //     minWidth: 180,
                //     sortable: false,
                //     headerName: 'currency',
                //     renderCell: ({ row }) => (
                //         <Typography noWrap variant='body2' title={row.currency}>
                //             {row.currency}
                //         </Typography>
                //     )
                // },
                {
                    field: 'documents',
                    flex: 0.1,
                    minWidth: 180,
                    sortable: false,
                    headerName: 'Documents',
                    renderCell: ({ row }) => (
                        <Typography noWrap variant='body2' title={row.documents?.map(doc => doc.title).join(', ')}>
                            {row.documents?.map(doc => doc?.title).join(', ')}
                        </Typography>
                    )
                },
                {
                    field: 'status',
                    minWidth: 180,
                    sortable: false,
                    headerName: 'Status',
                    renderCell: ({ row }) => <CustomChip label={row.status} />
                },
                {
                    field: 'Actions',
                    flex: 0,
                    minWidth: 170,
                    sortable: false,
                    headerName: 'Actions',
                    renderCell: ({ row }) => (
                        <Box display='flex' alignItems='center' gap='10px'>
                            <IconButton size='small' color='primary' variant='outlined' onClick={e => toggleEdit(e, 'edit', row)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size='small' color='secondary' onClick={e => toggleDelete(e, row)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )
                }
            ]}
            currentPage={currentPage}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
        />
    )
}

export default TablePinCode
