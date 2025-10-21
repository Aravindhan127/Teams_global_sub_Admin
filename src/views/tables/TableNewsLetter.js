import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Avatar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";

function TableNewsLetter({
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
            navigate(`/newsletter-detail/${row?.newsletterId}`);
        }
    };
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.newsletterId, // Add `id` for compatibility with CustomDataGrid
        index: index + 1,
    }));
    console.log("rows", rows)

    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'newsLetters.edit') || isMasterAdmin === true;

    const hasDeletePermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'newsLetters.delete') || isMasterAdmin === true;

    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        getRowId={(row) => row.id}
        columns={[
            {
                field: 'id',
                minWidth: 70,
                flex: 0.1,
                sortable: true,
                headerName: 'Id',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.index}>
                    {row?.index}
                </Typography>
            },
            {
                field: 'title',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'Title',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.title}>
                    {row?.title}
                </Typography>
            },
            {
                field: 'content',
                minWidth: 350,
                flex: 0.1,
                sortable: true,
                headerName: 'Content',
                renderCell: ({ row }) => {
                    const rawText = row?.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
                    const maxLength = 50; // Adjust as needed
                    const truncatedText = rawText.length > maxLength ? rawText.substring(0, maxLength) + "..." : rawText;

                    return (
                        <Typography
                            noWrap
                            variant="body2"
                            title={rawText} // Full text on hover
                        >
                            <div
                                style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                                dangerouslySetInnerHTML={{
                                    __html: `<style>p { margin: 0; }</style>${truncatedText}`,
                                }}
                            />
                        </Typography>
                    );
                }
            },

            {
                field: 'newsMediaUrl',
                minWidth: 200,
                flex: 0.1,
                sortable: true,
                headerName: 'Media',
                renderCell: ({ row }) =>
                    row?.newsMediaUrl ? (
                        row.newsMediaUrl.toLowerCase().endsWith(".pdf") ? (
                            <a
                                href={row.newsMediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "blue", textDecoration: "underline", fontWeight: "bold" }}
                            >
                                📄 View Document
                            </a>
                        ) : (
                            <Avatar
                                src={row.newsMediaUrl}
                                sx={{ width: 50, height: 50 }}
                            />
                        )
                    ) : "N/A"
            },

            {
                field: 'category',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'Category',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.category}>
                    {row?.category}
                </Typography>
            },
            {
                field: 'author',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'Author',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.author}>
                    {row?.author}
                </Typography>
            },
            {
                field: 'createdAt',
                flex: 0.5,
                minWidth: 200,
                sortable: false,
                headerName: 'Created Date',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.createdAt}>
                    {moment(row.createdAt).format('DD-MM-YYYY')}
                </Typography>
            },
            ...(hasEditPermission || hasDeletePermission
                ? [
                    {
                        field: 'Actions',
                        flex: 0,
                        minWidth: 170,
                        sortable: true,
                        headerName: 'Actions',
                        renderCell: ({ row }) => (
                            <Box display="flex" alignItems="center" gap="10px">
                                {hasEditPermission && (
                                    <IconButton size="small" color="primary" variant="outlined" onClick={(e) => navigate('/add-newsletter', { state: { mode: 'edit', dataToEdit: row } })}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                                {hasDeletePermission && (
                                    <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
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

}

export default TableNewsLetter
