import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete';

function TableChapter({
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
        Active: '#8bc34a',
        Inactive: '#FFB400',
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
    const mappedRows = rows?.map((row, index) => ({
        ...row,
        id: row?.chapterId, // Add `id` for compatibility with CustomDataGrid
        index: index + 1,
        isActive: row?.isActive ? 'Active' : 'Inactive',
    }));
    console.log("rows", rows)

    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'orgChapter.edit') || isMasterAdmin === true;

    // const hasActiveDeactivePermission =
    // rolePremission?.permissions?.some(item => item.permissionName === 'subadmin.activedeactive') || isMasterAdmin === true;
    return <CustomDataGrid
        // handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        getRowId={(row) => row?.id}
        columns={[
            {
                field: 'id',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Id',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.chapterId}>
                    {row?.index}
                </Typography>
            },
            {
                field: 'chapterName',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Chapter Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.chapterName}>
                    {row?.chapterName}
                </Typography>
            },
            {
                field: 'location',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Location',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.location}>
                    {row?.location}
                </Typography>
            },
            {
                field: 'yearEstablished',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Year Established',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.yearEstablished}>
                    {row?.yearEstablished}
                </Typography>
            },
            {
                field: 'isActive',
                minWidth: 150,
                sortable: true,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row.isActive}
                    onClick={(e) => toggleStatus(e, row)}
                />,
                filterable: true,
            },
            ...(hasEditPermission
                ? [
                    {
                        field: 'Actions',
                        flex: 0,
                        minWidth: 170,
                        sortable: true,
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
                ]
                : [])

        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableChapter
