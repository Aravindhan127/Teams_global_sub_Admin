import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

function TableHubAddress({
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
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions') {
            let hubaddressId = row._id;
            navigate(`/hub-address/${hubaddressId}`);
        }
        // You can add more logic for other fields if needed
    };
    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'name',
                flex: 1,
                minWidth: 250,
                sortable: false,
                headerName: 'Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.name}>
                    {row.name}
                </Typography>
            },
            {
                field: 'phoneNumber',
                flex: 1,
                minWidth: 250,
                sortable: false,
                headerName: 'Phone Number',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.phoneNumber}>
                    {row.phoneNumber}
                </Typography>
            },
            {
                field: 'address',
                minWidth: 300,
                sortable: false,
                headerName: 'Address',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.address}>
                    {row.address}
                </Typography>
            },
            {
                field: 'pincode',
                minWidth: 200,
                sortable: false,
                headerName: 'Post Code',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.pincode}>
                    {row.pincode}
                </Typography>
            },
            {
                field: 'city',
                minWidth: 150,
                sortable: false,
                headerName: 'City',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.city}>
                    {row.city}
                </Typography>
            },
            {
                field: 'state',
                minWidth: 150,
                sortable: false,
                headerName: 'State',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.state}>
                    {row.state}
                </Typography>
            },
            {
                field: 'country',
                minWidth: 150,
                sortable: false,
                headerName: 'Country',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.country}>
                    {row.country}
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

export default TableHubAddress
