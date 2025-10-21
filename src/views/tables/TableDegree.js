import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete';

function TableDegree({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleStatus,
    rolePremission,
    isMasterAdmin,
    departmentData,
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
    console.log("departmentData", departmentData)
    const getDeptName = (deptId) => {
        const dept = departmentData?.find((dept) => dept.deptId === deptId);
        return dept ? dept.deptName : "-";
    };
    const mappedRows = rows?.map((row, index) => ({
        ...row,
        // id: row.degreeId,
        id: index + 1,
        isActive: row.isActive ? 'Active' : 'Inactive',
        deptName: getDeptName(row.deptId),
    }));


    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'degree.edit') || isMasterAdmin === true;
    return <CustomDataGrid
        // handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        columns={[
            {
                field: 'id',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'Id',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.id}>
                    {row?.id}
                </Typography>
            },
            {
                field: 'degreeName',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Degree Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.degreeName}>
                    {row?.degreeName}
                </Typography>
            },
            {
                field: 'deptName',
                minWidth: 250,
                flex: 0.1,
                sortable: true, // Sorting will now work properly
                headerName: 'Department Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2'>
                    {row.deptName}
                </Typography>
            },

            {
                field: 'isActive',
                minWidth: 180,
                sortable: true,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row.isActive} />
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
                            <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row, 'degree')}>
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

export default TableDegree
