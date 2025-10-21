import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Avatar } from "@mui/material";

function TablePoll({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    rolePremission,
    isMasterAdmin,
    toggleStatus,
    toggleDelete,
}) {
    const statusColors = {
        approved: '#8bc34a',
        pending: '#FFB400',
        closed: '#9e9e9e',
        rejected: '#f44336'
    }
    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))
    const navigate = useNavigate();
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status') {
            navigate(`/state/${row?.id}`);
        }
    };
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.loungeId,
        index: index + 1,
    }));
    console.log("rows", rows)

    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'orgChapter.edit') || isMasterAdmin === true;

    return <CustomDataGrid
        // handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        getRowId={(row) => row.id}
        columns={[
            {
                field: 'id',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'Id',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.index}
                >
                    {row?.index}
                </Typography>
            },
            {
                field: 'question',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Question',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.title}
                >
                    {row?.title}
                </Typography>
            },
            {
                field: 'options',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Options',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.description}
                >
                    {row?.description}
                </Typography>
            },

            // ...(hasEditPermission
            //     ? [
            //         {
            //             field: 'Actions',
            //             flex: 0,
            //             minWidth: 170,
            //             sortable: true,
            //             headerName: 'Actions',
            //             renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
            //                 <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
            //                     <EditIcon />
            //                 </IconButton>
            //             </Box>
            //         }
            //     ]
            //     : [])

        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TablePoll
