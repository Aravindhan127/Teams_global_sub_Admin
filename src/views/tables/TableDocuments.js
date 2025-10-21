import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CustomDataGrid from 'src/@core/components/data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

function TableDocuments({
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
        inactive: '#FFB400',
        active: '#66bb6a'
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
                    field: 'title',
                    flex: 0.1,
                    minWidth: 180,
                    sortable: false,
                    headerName: 'Title',
                    renderCell: ({ row }) => (
                        <Typography noWrap variant='body2' title={row.title}>
                            {row.title}
                        </Typography>
                    )
                },
                {
                    field: 'key',
                    flex: 0.1,
                    minWidth: 180,
                    sortable: false,
                    headerName: 'Key',
                    renderCell: ({ row }) => (
                        <Typography noWrap variant='body2' title={row.key}>
                            {row.key}
                        </Typography>
                    )
                },
                {
                    field: 'vehicleType',
                    flex: 0.1,
                    minWidth: 180,
                    sortable: false,
                    headerName: 'Vehicle Type',
                    renderCell: ({ row }) => (
                        <Typography noWrap variant='body2' title={row?.vehicleType?.name}>
                            {row?.vehicleType?.map(item => item?.name).join(', ')}
                        </Typography>
                    )
                },
                // {
                //   field: 'maxFileCounts',
                //   flex: 0.1,
                //   minWidth: 180,
                //   sortable: false,
                //   headerName: 'MaxFileCounts',
                //   renderCell: ({ row }) => (
                //     <Typography noWrap variant='body2' title={row.maxFileCounts}>
                //       {row.maxFileCounts}
                //     </Typography>
                //   )
                // },
                // {
                //   field: 'maxSize',
                //   flex: 0.1,
                //   minWidth: 180,
                //   sortable: false,
                //   headerName: 'MaxSize',
                //   renderCell: ({ row }) => (
                //     <Typography noWrap variant='body2' title={row.maxSize}>
                //       {row.maxSize}
                //     </Typography>
                //   )
                // },
                {
                    field: 'description',
                    flex: 0.1,
                    minWidth: 180,
                    sortable: false,
                    headerName: 'Description',
                    renderCell: ({ row }) => (
                        <Typography noWrap variant='body2' title={row.description}>
                            {row.description}
                        </Typography>
                    )
                },
                {
                    field: 'required',
                    flex: 0,
                    minWidth: 150,
                    sortable: false,
                    headerName: 'Required',
                    renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.required}>
                        {row.required ? 'Yes' : 'No'}
                    </Typography>
                },
                {
                    field: 'status',
                    flex: 0,
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

export default TableDocuments
