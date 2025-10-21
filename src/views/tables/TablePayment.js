import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import moment from "moment";

function TablePayment({
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

    return <CustomDataGrid
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'Customer Name',
                minWidth: 200,
                sortable: false,
                headerName: 'Customer Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.customerName}>
                    {row.customerName}
                </Typography>
            },
            {
                field: 'Driver Name',
                minWidth: 200,
                sortable: false,
                headerName: 'Driver Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.DriverName}>
                    {row.DriverName}
                </Typography>
            },
            {
                field: 'Order Type',
                minWidth: 200,
                sortable: false,
                headerName: 'Order Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.OrderType}>
                    {row.OrderType}
                </Typography>
            },
            {
                field: 'updatedAt',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'createdAt',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.updatedAt}>
                    {moment(row.updatedAt).format('DD-MM-YYYY HH:mm')}
                </Typography>
            },
            {
                field: 'Delivery Date',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'Delivery Date',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.DeliveryDate}>
                    {moment(row.DeliveryDate).format('DD-MM-YYYY HH:mm')}
                </Typography>
            },
            {
                field: 'Payment Type',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'Payment Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.PaymentType}>
                    {row.PaymentType}
                </Typography>
            },
            {
                field: 'status',
                flex: 0,
                minWidth: 180,
                sortable: false,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row?.status} />
            },
            // {
            //     field: 'Actions',
            //     flex: 0.5,
            //     minWidth: 170,
            //     sortable: false,
            //     headerName: 'Actions',
            //     renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
            //         <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
            //             <EditIcon />
            //         </IconButton>
            //         <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
            //             <DeleteIcon />
            //         </IconButton>
            //     </Box>
            // }
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TablePayment
