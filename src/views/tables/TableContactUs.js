import { Box, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import CustomDataGrid from "src/@core/components/data-grid";
import ReplyIcon from '@mui/icons-material/Reply';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
function TableContactUs({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleDelete,
    toggleView
}) {
    return <CustomDataGrid
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'full_name',
                minWidth: 150,
                sortable: false,
                headerName: 'Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.full_name}>
                    {row.full_name}
                </Typography>
            },
            {
                field: 'email',
                minWidth: 250,
                sortable: false,
                headerName: 'Email',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.email}>
                    {row.email}
                </Typography>
            },
            {
                field: 'message',
                minWidth: 500,
                sortable: false,
                headerName: 'Message',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row.message}>
                    {row.message}
                </Typography>
            },
            {
                field: 'phone_number',
                minWidth: 200,
                sortable: false,
                headerName: 'Phone Number',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.phone_number}>
                    {row.phone_number}
                </Typography>
            },
            {
                field: 'replyContent',
                minWidth: 300,
                sortable: false,
                headerName: 'Admin Reply Content',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.replyContent}>
                    {row.replyContent}
                </Typography>
            },
            {
                field: 'Actions',
                flex: 0,
                minWidth: 170,
                sortable: false,
                headerName: 'Actions',
                renderCell: ({ row }) => (
                    <Box display='flex' alignItems='center' gap='10px'>
                        <IconButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={(e) => toggleView(e, row)}
                        >
                            <RemoveRedEyeIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={(e) => toggleEdit(e, row)}
                            disabled={row.replied}
                        >
                            <ReplyIcon />
                        </IconButton>
                    </Box>
                )
            }

        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableContactUs
