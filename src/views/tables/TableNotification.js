import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'

function TableNotification({
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

    const mappedRows = rows?.map((row, index) => ({
        ...row,
        id: row.notificationId,
        firstName: row?.userData?.appUser?.firstName,
        lastName: row?.userData?.appUser?.lastName,
        userType: row?.userData?.userType,
        status: row?.userData?.status,
    }));
    return <CustomDataGrid
        //handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        columns={[
            {
                field: 'firstName',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'First Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.firstName}>
                    {row?.firstName}
                </Typography>
            },
            {
                field: 'lastName',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'Last Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.lastName}>
                    {row?.lastName}
                </Typography>
            },
            {
                field: 'userType',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'User Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.userType}>
                    {row?.userType}
                </Typography>
            },
            {
                field: 'status',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'status',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.status}>
                    {row?.status}
                </Typography>
            },
            // {
            //     field: 'Actions',
            //     flex: 0,
            //     minWidth: 170,
            //     sortable: false,
            //     headerName: 'Actions',
            //     renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
            //         <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
            //             <EditIcon />
            //         </IconButton>
            //         {/* <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
            //             <DeleteIcon />
            //         </IconButton> */}
            //     </Box>
            // }
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableNotification
