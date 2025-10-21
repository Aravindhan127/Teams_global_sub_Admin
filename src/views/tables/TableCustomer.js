import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import moment from "moment";
import { MEDIA_URL } from "src/network/endpoints";

function TableCustomer({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleDelete,
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
    const navigate = useNavigate();

    return <CustomDataGrid
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'user_id',
                minWidth: 180,
                sortable: false,
                headerName: 'User ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.user_id}>
                    {row.user_id}
                </Typography>
            },
            {
                field: 'Registration Date',
                minWidth: 200,
                sortable: false,
                headerName: 'Date',
                renderCell: ({ row }) => (
                    <Typography noWrap variant='body2' title={row.createdAt}>
                        {moment(row?.createdAt).format('DD/MM/YYYY HH:mm') || '-'}
                    </Typography>
                )
            },
            {
                field: 'full_name',
                minWidth: 250,
                sortable: false,
                headerName: 'Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.full_name}>
                    {row.full_name}
                </Typography>
            },
            {
                field: 'profile_picture',
                flex: 0.1,
                minWidth: 180,
                sortable: false,
                headerName: 'Profile Image',
                renderCell: ({ row }) => (
                    <Typography noWrap variant='body2' textTransform={'capitalize'} title={row.profile_picture}>
                        <img src={`${MEDIA_URL}${row.profile_picture}`} alt='' style={{ maxWidth: '70px', maxHeight: '70px' }} />
                    </Typography>
                )
            },
            {
                field: 'email',
                minWidth: 250,
                flex: 0.5,
                sortable: false,
                headerName: 'Email',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.email}>
                    {row.email}
                </Typography>
            },
            {
                field: 'isBusinessAccount',
                minWidth: 200,
                flex: 0.5,
                sortable: false,
                headerName: 'Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.isBusinessAccount}>
                    {row?.isBusinessAccount ? 'Business' : 'Individual'}
                </Typography>
            },
            {
                field: 'Location',
                minWidth: 200,
                flex: 0.5,
                sortable: false,
                headerName: 'Location',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.location}>
                    {row?.location || '-'}
                </Typography>
            },
            {
                field: 'phone_number',
                minWidth: 200,
                flex: 0.5,
                sortable: false,
                headerName: 'Phone Number',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.phone_number}>
                    {row.phone_number}
                </Typography>
            },
            {
                field: 'status',
                minWidth: 180,
                flex: 0.5,
                sortable: false,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row.status} />
            },
            {
                field: 'Actions',
                minWidth: 300,
                sortable: false,
                headerName: 'Actions',
                renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
                    <Button size='small' color='primary' variant='outlined'
                        onClick={() => navigate(`/customer/${row._id}`)}
                    >Customer History</Button>
                    <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            }
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableCustomer
