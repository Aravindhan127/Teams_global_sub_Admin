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
function TableMailCampaign({
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
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState(null);
    const [selectedRowData, setSelectedRowData] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status') {
            navigate(`/event-detail/${row?.eventId}`);
        }
    };
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.campaignId,
        index: index + 1,
    }));


    const allIds = mappedRows.map(row => row.id);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (event, id) => {
        if (event.target.checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(rowId => rowId !== id));
        }
    };

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedIds); // notify parent
        }
    }, [selectedIds]);
    const hasDetailPagePermission = rolePremission?.permissions?.some(item => item.permissionName === 'campaign.detail') || isMasterAdmin === true;
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
                    // {
                    //     field: 'checkbox',
                    //     headerName: (
                    //         <Checkbox
                    //             checked={selectedIds.length === allIds.length && allIds.length > 0}
                    //             indeterminate={selectedIds.length > 0 && selectedIds.length < allIds.length}
                    //             onChange={handleSelectAll}
                    //             sx={{
                    //                 color: '#ED1E79',
                    //                 '&.Mui-checked': {
                    //                     color: '#ED1E79',
                    //                 },
                    //             }}
                    //         />
                    //     ),
                    //     width: 100,
                    //     sortable: false,
                    //     disableColumnMenu: true,
                    //     filterable: false,
                    //     renderCell: ({ row }) => (
                    //         <Checkbox
                    //             checked={selectedIds.includes(row.id)}
                    //             onChange={(e) => handleSelectRow(e, row.id)}
                    //             sx={{
                    //                 color: '#ED1E79',
                    //                 '&.Mui-checked': {
                    //                     color: '#ED1E79',
                    //                 },
                    //             }}
                    //         />
                    //     )
                    // },
                    {
                        field: 'id',
                        minWidth: 150,
                        sortable: true,
                        flex: 0.1,
                        headerName: 'Campaign ID',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.id}>
                            {row?.id}
                        </Typography>
                    },
                    {
                        field: 'campaignType',
                        minWidth: 150,
                        sortable: true,
                        flex: 0.1,
                        headerName: 'Campaign Type',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.campaignType}>
                            {row?.campaignType === 'inApp' ? "In App" : row?.campaignType === 'pushNotification' ? "Push Notification" : row?.campaignType === 'mailCampaign' ? "Mail Campaign" : '-'}
                        </Typography>
                    },
                    {
                        field: 'subject',
                        minWidth: 150,
                        sortable: true,
                        flex: 0.1,
                        headerName: 'Subject',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.subject}>
                            {row?.subject || '-'}
                        </Typography>
                    },
                    {
                        field: 'content',
                        minWidth: 200,
                        flex: 0.1,
                        sortable: true,
                        headerName: 'Content',
                        renderCell: ({ row }) => (
                            <Typography
                                noWrap
                                variant='body2'
                                title={row?.content}
                                dangerouslySetInnerHTML={{ __html: row?.content || '-' }}
                            />
                        )
                    },

                    {
                        field: 'createdAt',
                        minWidth: 200,
                        flex: 0.1,
                        sortable: true,
                        headerName: 'Created At',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.createdAt}>
                            {moment(row?.createdAt).format('DD-MM-YYYY')}
                        </Typography>
                    },
                    ...(hasDetailPagePermission
                        ? [
                            {
                                field: 'Actions',
                                flex: 0,
                                minWidth: 350,
                                sortable: true,
                                align: 'center',
                                headerAlign: 'center',
                                headerName: 'Actions',
                                renderCell: ({ row }) => (
                                    <Box display="flex" alignItems="center" gap="10px">

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={(e) => navigate(`/email-composed-user/${row.campaignId}`, { state: { mode: 'edit', dataToEdit: row } })}
                                        >
                                            View Users
                                        </Button>

                                    </Box>
                                )
                            }
                        ]
                        : [])

                ]}
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
            />



        </>
    )





}

export default TableMailCampaign
