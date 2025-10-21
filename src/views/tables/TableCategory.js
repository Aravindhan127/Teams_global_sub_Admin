import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import moment from 'moment'

function TableCategory({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleDelete,
    rolePremission,
    isMasterAdmin
}) {


    const mappedRows = rows?.map((row, index) => ({
        ...row,
        id: row?.categoryId,
        index: index + 1,
    }));

    const hasEditPermission = rolePremission?.permissions?.some(item => item.permissionName === 'eventCat.edit') || isMasterAdmin === true;
    const hasDeletePermission = rolePremission?.permissions?.some(item => item.permissionName === 'eventCat.delete') || isMasterAdmin === true;

    return <CustomDataGrid
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        nofilter={true}
        columns={[
            {
                field: 'id',
                minWidth: 200,
                sortable: false,
                headerName: 'ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.index}>
                    {row.index}
                </Typography>
            },
            {
                field: 'name',
                minWidth: 200,
                sortable: false,
                headerName: 'Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.name}>
                    {row.name}
                </Typography>
            },
            {
                field: 'createdAt',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'Created At',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.createdAt}>
                    {moment(row.createdAt).format('DD-MM-YYYY')}
                </Typography>
            },
            ...(hasEditPermission || hasDeletePermission
                ? [
                    {
                        field: 'Actions',
                        flex: 0.5,
                        minWidth: 170,
                        sortable: false,
                        disableColumnMenu: false,
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

export default TableCategory
