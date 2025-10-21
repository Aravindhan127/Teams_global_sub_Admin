import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";
import VisibilityIcon from '@mui/icons-material/Visibility';
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import Checkbox from '@mui/material/Checkbox';
import Switch from "react-switch";
function TableMailComposedUsers({
    rows,
    totalCount,
    handleSwitchToggle,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleStates,
    eventName,
    rolePremission,
    isMasterAdmin,
    toggleStatus,
    toggleDelete,
    onSelectionChange,
    selectedIds,
    setSelectedIds,

}) {

    const { user } = useAuth();
    const userType = user?.orgDetails?.orgType;
    const navigate = useNavigate();
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status') {
            navigate(`/event-detail/${row?.eventId}`);
        }
    };
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.userSeqId,
        index: index + 1,
        name: `${row?.firstName || ''} ${row?.lastName || ''}`,
        email: row?.appUser?.userEmail
    }));


    return (
        <>
            <CustomDataGrid
                // handleCellClick={handleCellClick}
                loading={loading}
                rowCount={totalCount}
                rows={mappedRows}
                getRowId={(row) => row.id}
                hideToolBarEvent={true}
                columns={[

                    {
                        field: 'id',
                        minWidth: 100,
                        sortable: true,
                        headerName: 'Id',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.id}>
                            {row?.id}
                        </Typography>
                    },
                    {
                        field: 'name',
                        minWidth: 200,
                        sortable: true,
                        headerName: 'Name',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.name}>
                            {row?.name}
                        </Typography>
                    },
                    {
                        field: 'email',
                        minWidth: 150,
                        sortable: true,
                        flex: 0.1,
                        headerName: 'Email',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.email}>
                            {row?.email || '-'}
                        </Typography>
                    },
                    ...(userType === 'college'
                        ? [
                            {
                                field: 'userType',
                                minWidth: 150,
                                sortable: true,
                                flex: 0.1,
                                headerName: 'User Type',
                                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.userType}>
                                    {row?.userType || '-'}
                                </Typography>
                            }
                        ]
                        : []),

                    ...(userType === 'college'
                        ? [
                            {
                                field: 'passoutYear',
                                minWidth: 150,
                                sortable: true,
                                flex: 0.1,
                                headerName: 'Batch',
                                renderCell: ({ row }) => (
                                    <Typography noWrap variant="body2" title={row?.passoutYear}>
                                        {row?.passoutYear || '-'}
                                    </Typography>
                                ),
                            },
                            {
                                field: 'department',
                                minWidth: 150,
                                sortable: true,
                                flex: 0.1,
                                headerName: 'Department',
                                renderCell: ({ row }) => (
                                    <Typography noWrap variant="body2" title={row?.department?.deptName}>
                                        {row?.department?.deptName || '-'}
                                    </Typography>
                                ),
                            },
                            {
                                field: 'degree',
                                minWidth: 150,
                                sortable: true,
                                flex: 0.1,
                                headerName: 'Degree',
                                renderCell: ({ row }) => (
                                    <Typography noWrap variant="body2" title={row?.degree?.degreeName}>
                                        {row?.degree?.degreeName || '-'}
                                    </Typography>
                                ),
                            },
                        ]
                        : []),
                ]}
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
            />



        </>
    )

}

export default TableMailComposedUsers
