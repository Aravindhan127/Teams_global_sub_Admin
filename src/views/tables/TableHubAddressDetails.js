import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import MoreVertIcon from '@mui/icons-material/MoreVert';
function TableHubAddressDetails({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleView
}) {
    // const statusColors = {
    //     inactive: '#FFB400',
    //     active: '#66bb6a'
    // }
    const CustomChip = styled(Chip)(({ label }) => ({
        //backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        //color: '#fff',
        width: '150px'
    }))
    return <CustomDataGrid
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'deliveredTime',
                minWidth: 200,
                sortable: false,
                headerName: 'Created Time',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.deliveredTime}>
                    {moment(row.deliveredTime).format('DD-MM-YYYY HH:MM')}
                </Typography>
            },
            {
                field: 'order_ID',
                minWidth: 200,
                sortable: false,
                headerName: 'Order ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.order_ID}>
                    {row.order_ID}
                </Typography>
            },
            {
                field: 'customer',
                minWidth: 200,
                sortable: false,
                headerName: 'Customer Number',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.customer?.phone_number}>
                    {row?.customer?.phone_number}
                </Typography>
            },
            {
                field: 'driver',
                minWidth: 150,
                sortable: false,
                headerName: 'Driver Number',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.driver?.phone_number}>
                    {row?.driver?.phone_number}
                </Typography>
            },
            {
                field: 'status',
                minWidth: 250,
                sortable: false,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row.status} />
            },
            {
                field: 'Actions',
                minWidth: 170,
                sortable: false,
                headerName: 'Actions',
                renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
                    <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleView(e, row)}>
                        <MoreVertIcon />
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

export default TableHubAddressDetails
