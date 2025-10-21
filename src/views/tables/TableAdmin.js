import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'

function TableAdmin({
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
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.orgAdminId,
        index: index + 1,
        roleName: row.roles?.roleName || '-',
        isActive: row.isActive ? 'Active' : 'Inactive',
    }));
    console.log("rows", rows)
    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'subadmin.edit') || isMasterAdmin === true;

    const hasActiveDeactivePermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'subadmin.activedeactive') || isMasterAdmin === true;
    return <CustomDataGrid
        // handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        getRowId={(row) => row.id}
        columns={[
            {
                field: 'id',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Id',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.index}>
                    {row?.index}
                </Typography>
            },
            {
                field: 'firstName',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'First Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.firstName}>
                    {row?.firstName}
                </Typography>
            },
            {
                field: 'lastName',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Last Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.lastName}>
                    {row?.lastName}
                </Typography>
            },
            {
                field: 'userEmail',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Email',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.userEmail}>
                    {row?.userEmail}
                </Typography>
            },
            {
                field: 'roleName',
                minWidth: 250,
                sortable: true,
                headerName: 'Role',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.roles?.roleName}>
                    {row?.roles?.roleName ? row?.roles?.roleName : '-'}
                </Typography>
            },
            {
                field: 'isActive',
                minWidth: 150,
                sortable: true,
                headerName: 'Status',
                renderCell: ({ row }) =>
                    <CustomChip
                        label={row.isActive}
                        onClick={hasActiveDeactivePermission ? (e) => toggleStatus(e, row) : undefined}
                        style={{
                            cursor: hasActiveDeactivePermission ? 'pointer' : 'not-allowed',
                        }}
                    />,
                // Ensure that isActive is filtered as "Active" or "Inactive"
                filterable: true,
            },
            // ...(hasEditPermission
            //     ? [{
            //         field: 'Actions',
            //         flex: 0,
            //         minWidth: 170,
            //         sortable: true,
            //         headerName: 'Actions',
            //         renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
            //             <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
            //                 <EditIcon />
            //             </IconButton>
            //         </Box>
            //     }]
            //     : [])
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableAdmin
