import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import moment from "moment";

function TableReferFriend({
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
                field: 'type',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row.type}>
                    {row.type}
                </Typography>
            },
            {
                field: 'title',
                minWidth: 250,
                flex: 0.1,
                sortable: false,
                headerName: 'Title',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.title}>
                    {row.title}
                </Typography>
            },
            {
                field: 'subTitle',
                minWidth: 300,
                flex: 0.1,
                sortable: false,
                headerName: 'Sub Title',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.subTitle}>
                    {row.subTitle}
                </Typography>
            },
            {
                field: 'code',
                minWidth: 100,
                flex: 0.1,
                sortable: false,
                headerName: 'Code',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.code}>
                    {row.code}
                </Typography>
            },
            {
                field: 'description',
                minWidth: 350,
                flex: 0.1,
                sortable: false,
                headerName: 'Description',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.description}>
                    {row?.description}
                </Typography>
            },
            {
                field: 'createdAt',
                flex: 0.5,
                minWidth: 150,
                sortable: false,
                headerName: 'CreatedAt',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.createdAt}>
                    {moment(row.createdAt).format('DD-MM-YYYY')}
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

export default TableReferFriend
