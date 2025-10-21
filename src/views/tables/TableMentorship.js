import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Avatar, Button, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import right from "../../assets/images/right.svg"
import wrong from "../../assets/images/wrong.svg"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
function TableMentorship({
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
    loungeType,
    handleAction,
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
        if (field !== 'Actions' && field !== 'status' && field !== 'loungeActions') {
            navigate(`/lounge/${row?.loungeId}`);
        }
    };
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.loungeId,
        index: index + 1,
        isCreatedByAdmin: row?.isCreatedByAdmin === true ? "Admin" : "User",
        firstName: row?.collegeUser?.appUser?.firstName || row?.orgUser?.appUser?.firstName || row?.adminData?.firstName,
        lastName: row?.collegeUser?.appUser?.lastName || row?.orgUser?.appUser?.lastName || row?.adminData?.lastName,
    }));
    console.log("rows", rows)

    const hasOptions = rows.some(row => row?.options?.length > 0);
    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'orgChapter.edit') || isMasterAdmin === true;

    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        hideToolBarEvent={true}
        rows={mappedRows}
        getRowId={(row) => row.id}
        columns={[
            {
                field: 'id',
                minWidth: 100,
                flex: 0.1,
                sortable: true,
                headerName: 'SNo',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.index}
                >
                    {row?.index}
                </Typography>
            },

            {
                field: 'name',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.name}
                >
                    {row?.name || row?.name}
                </Typography>
            },



            {
                field: 'expertise',
                minWidth: 200,
                flex: 0.1,
                sortable: true,
                headerName: 'Expertise',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.expertise}
                >
                    {row?.expertise}
                </Typography>
            },
            {
                field: 'mentees',
                minWidth: 200,
                flex: 0.1,
                sortable: true,
                headerName: 'Mentees',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.mentees}
                >
                    {row?.mentees}
                </Typography>
            },

            {
                field: 'status',
                minWidth: 150,
                flex: 0.2,
                sortable: true,
                headerName: 'Status',
                renderCell: ({ row }) =>
                    <Box sx={{ display: "flex", alignItems: "center", width: '100%' }}>
                        <CustomChip
                            label={row?.status}
                            sx={{
                                cursor: row?.status === "pending" ? "pointer" : "default",
                            }}
                        />
                    </Box>
                ,
                filterable: true,
            },
            {
                field: 'Actions',
                flex: 0,
                minWidth: 250,
                sortable: true,
                align: 'center',
                headerAlign: 'center',
                headerName: 'Actions',
                renderCell: ({ row }) => {
                    console.log("isCreatedByAdmin:", row.isCreatedByAdmin); // Debugging

                    return (
                        <Box display='flex' alignItems='center' gap='10px'>
                            {/* Conditionally render the EditIcon button */}
                            {row.isCreatedByAdmin === 'Admin' && (
                                <IconButton size="small" color="primary" variant="outlined"
                                    onClick={(e) => toggleEdit(e, "edit", row)}
                                >
                                    <EditIcon />
                                </IconButton>
                            )}
                            {row.isCreatedByAdmin === 'Admin' && (
                                <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                            <Tooltip title="Approve">
                                <IconButton
                                    onClick={(e) => row.status === "pending" && handleAction(e, "approved", row)}
                                    disabled={row.status !== "pending"}
                                    sx={{
                                        bgcolor: row.status !== "pending" ? "#ddd" : "#00800024",
                                        borderRadius: '10px',
                                        opacity: row.status !== "pending" ? 0.5 : 1,
                                        pointerEvents: row.status !== "pending" ? "none" : "auto",
                                    }}
                                >
                                    <CheckCircleOutlineOutlinedIcon
                                        sx={{
                                            fill: row.status !== "pending" ? 'gray' : 'green'
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Reject">
                                <IconButton
                                    onClick={(e) => row.status === "pending" && handleAction(e, "rejected", row)}
                                    disabled={row.status !== "pending"}
                                    sx={{
                                        bgcolor: row.status === "rejected" ? "#ddd" : '#ff00001f',
                                        borderRadius: '10px',
                                        opacity: row.status !== "pending" ? 0.5 : 1,
                                        pointerEvents: row.status !== "pending" ? "none" : "auto",
                                    }}
                                >
                                    <CancelOutlinedIcon
                                        sx={{
                                            fill: row.status !== "pending" ? 'gray'
                                                : 'red'
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    );
                },
            }


            // ]
            // : [])

        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableMentorship
