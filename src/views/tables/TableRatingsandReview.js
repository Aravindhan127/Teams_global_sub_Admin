import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Rating } from "@mui/material";

function TableRatingsandReview({
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
    const navigate = useNavigate();
    // const handleCellClick = ({ row, field }) => {
    //     if (field !== 'Actions') {
    //         let driverId = row._id;
    //         navigate(`/driver/${driverId}`);
    //     }
    //     // You can add more logic for other fields if needed
    // };
    return <CustomDataGrid
        //handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'order_ID',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'Ride Code',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.order_ID}>
                    {row.order_ID}
                </Typography>
            },
            {
                field: 'full_name',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'User',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.customer?.full_name}>
                    {row?.customer?.full_name}
                </Typography>
            },
            {
                field: 'Average Rating',
                minWidth: 200,
                sortable: false,
                headerName: 'User Rating',
                renderCell: ({ row }) => (
                    <Typography noWrap variant='body2' title={row.phone_number}>
                        <Rating name="read-only" value={4} readOnly />
                    </Typography>
                )
            },
            {
                field: 'phone_number',
                minWidth: 200,
                sortable: false,
                headerName: 'User Comment',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.customer?.phone_number}>
                    {row?.customer?.phone_number}
                </Typography>
            },
            // {
            //     field: 'Average Rating',
            //     minWidth: 200,
            //     sortable: false,
            //     headerName: 'Driver Rating',
            //     renderCell: ({ row }) => (
            //         <Typography noWrap variant='body2' title={row.phone_number}>
            //             <Rating name="read-only" value={4} readOnly />
            //         </Typography>
            //     )
            // },
            {
                field: 'phone_number',
                minWidth: 200,
                sortable: false,
                headerName: 'Driver Comment',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.customer?.phone_number}>
                    {row?.customer?.phone_number}
                </Typography>
            },
            {
                field: 'Actions',
                flex: 0,
                minWidth: 170,
                sortable: false,
                headerName: 'Actions',
                renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
                    <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
                        <EditIcon />
                    </IconButton>
                    {/* <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
                        <DeleteIcon />
                    </IconButton> */}
                </Box>
            }
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableRatingsandReview
