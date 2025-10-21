import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CustomDataGrid from 'src/@core/components/data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled } from '@mui/material/styles'
import { Chip } from '@mui/material'

function TableSocialMedia({
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
                    field: 'name',
                    flex: 0.1,
                    minWidth: 300,
                    sortable: false,
                    headerName: 'Title',
                    renderCell: ({ row }) => (
                        <Typography noWrap variant='body2' title={row?.name}>
                            {row?.name}
                        </Typography>
                    )
                },
                {
                    field: 'link',
                    flex: 0.1,
                    minWidth: 180,
                    sortable: false,
                    headerName: 'Links',
                    renderCell: ({ row }) => (
                        <Typography noWrap variant='body2' title={row.link}>
                            {row.link}
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
                            {/* <IconButton size='small' color='secondary' onClick={e => toggleDelete(e, row)}>
                                <DeleteIcon />
                            </IconButton> */}
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

export default TableSocialMedia
