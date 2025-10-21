import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DownloadIcon from '@mui/icons-material/Download';
import toast from "react-hot-toast";
function TableBulkUpload({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleDelete,
    toggleView,
    onCellClick
}) {
    const handleCellClick = (_id) => {
        onCellClick(_id);
    };


    const rowsWithIndex = rows?.map((item, index) => ({
        ...item,
        id: item?.invitationId || item?.userSeqId,
        index: index + 1,
        personId: item?.personId ? 'Registered' : 'Pending'
    }));

    console.log("row", rows)
    return <CustomDataGrid
        loading={loading}
        rowCount={totalCount}
        rows={rowsWithIndex}
        columns={[
            {
                field: 'id',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'User ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.index}>
                    {row?.id}
                </Typography>
            },
            {
                field: 'firstName',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'First Name',
                renderCell: (params) => (
                    <Typography noWrap variant="body2" title={params?.row.firstName}>
                        {params?.row?.firstName ? params?.row.firstName : '-'}</Typography>
                ),
            },
            {
                field: 'lastName',
                minWidth: 250,
                flex: 0.1,
                sortable: true,
                headerName: 'Last Name',
                renderCell: (params) => (
                    <Typography noWrap variant="body2" title={params?.row.lastName}>
                        {params?.row?.lastName ? params?.row.lastName : '-'}</Typography>
                ),
            },
            {
                field: 'userEmail',
                flex: 0.1,
                minWidth: 250,
                sortable: true,
                headerName: 'Email',
                renderCell: (params) => (
                    <Typography noWrap variant="body2" title={params?.row?.userEmail}>
                        {params?.row?.userEmail ? params?.row?.userEmail : '-'}</Typography>
                ),
            },
            {
                field: 'personId',
                flex: 0.1,
                minWidth: 250,
                sortable: true,
                headerName: 'Status',
                renderCell: (params) => (
                    <Typography noWrap variant="body2">
                        {params?.row?.personId}</Typography>
                ),
                filterable: true,
            },

            // {
            //     field: 'actions',
            //     flex: 0,
            //     minWidth: 170,
            //     sortable: true,
            //     headerName: 'Actions',
            //     renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
            //         <IconButton
            //             size="small"
            //             color="primary"
            //             variant="outlined"
            //             onClick={() => handleDownload(row.uploaded_file, row.file_description)}
            //         >
            //             <DownloadIcon />
            //         </IconButton>
            //         <IconButton size="small" color="secondary"
            //          onClick={(e) => toggleDelete(e, row)}
            //         >
            //             <DeleteIcon />
            //         </IconButton>
            //     </Box>
            // }
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableBulkUpload
