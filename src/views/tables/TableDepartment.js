import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete';
function TableDepartment({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleStatus,
    handleCellClick,
    selectedCellId,
    rolePremission,
    isMasterAdmin,
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

    const mappedRows = rows.map((row, index) => ({
        ...row,
        // id: row.deptId,
        id: index + 1,
        isActive: row.isActive ? 'Active' : 'Inactive',
    }));

    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'dept.edit') || isMasterAdmin === true;

    return <CustomDataGrid
        handleCellClick={(params) => handleCellClick(params.row.deptId)}
        loading={loading}
        selectedCellId={selectedCellId}
        rowCount={totalCount}
        rows={mappedRows}
        columns={[
            {
                field: 'id',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Id',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.id}>
                    {row.id}
                </Typography>
            },
            {
                field: 'deptName',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Department Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.deptName}>
                    {row?.deptName}
                </Typography>
            },


            {
                field: 'isActive',
                minWidth: 150,
                sortable: true,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row.isActive} />,
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
                            <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row, 'dept')}>
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

export default TableDepartment
