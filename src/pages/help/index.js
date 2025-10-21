import { useEffect, useState, useRef, useCallback } from "react"
import { Button, Grid, MenuItem, Select, Typography } from "@mui/material"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import PageHeader from "src/@core/components/page-header"
import Translations from "src/layouts/components/Translations"
import { axiosInstance } from "src/network/adapter"
import { ApiEndPoints } from "src/network/endpoints"
import { DefaultPaginationSettings } from "src/constants/general.const"
import { toastError, toastSuccess } from "src/utils/utils"
import DialogConfirmation from "src/views/dialog/DialogConfirmation"
import TableHelps from "src/views/tables/TableHelps"
import DialogFormHelp from "src/views/dialog/DialogFormHelp"

const HelpPage = () => {

    const searchTimeoutRef = useRef();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const [helpsdata, setHelpsData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    // Testimonials
    const [helpsFormDialogOpen, setHelpsFormDialogOpen] = useState(false);
    const [helpsFormDialogMode, setHelpsFormDialogMode] = useState("add");
    const [helpsToEdit, setHelpsToEdit] = useState(null);

    const toggleFaqsFormDialog = (e, mode = "add", helpsToEdit = null) => {
        setHelpsFormDialogOpen(prev => !prev);
        setHelpsFormDialogMode(mode);
        setHelpsToEdit(helpsToEdit);
    }

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [helpsToDelete, setHelpsToDelete] = useState(null);

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setHelpsToDelete(dataToDelete)
    }



    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search, status }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search,
            status: status
        };

        axiosInstance
            .get(ApiEndPoints.HELP.list, { params })
            .then((response) => {
                setHelpsData(response.data.data.helps)
                setTotalCount(response.data.data.totalCount)
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
            status: status
        });
    }, [currentPage, pageSize, search, status]);

    const handleSearchChange = (e) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value);
        }, 500)
    }

    const onConfirmDelete = useCallback((e) => {
        e?.preventDefault();
        setConfirmationDialogLoading(true);
        axiosInstance
            .delete(ApiEndPoints.HELP.delete(helpsToDelete._id))
            .then((response) => response.data)
            .then((response) => {
                fetchData({
                    currentPage: currentPage,
                    pageSize: pageSize,
                    search: search,
                });
                toggleConfirmationDialog();
                toastSuccess(response.message);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setConfirmationDialogLoading(false);
            })
    }, [currentPage, helpsToDelete, pageSize, search])

    return <>
        <Grid container spacing={4} className="match-height">
            <PageHeader
                title={
                    <Typography variant="h5">
                        <Translations text="Help" />
                    </Typography>
                }
                action={
                    <Button variant="contained" onClick={toggleFaqsFormDialog}>
                        Add Helps
                    </Button>
                }
            />
            <Grid item xs={12}>
                <Card>
                    <Box sx={{ p: 5, pb: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box></Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 }}>
                            <Select
                                size='small'
                                defaultValue={' '}
                                sx={{ bgcolor: '#F7FBFF' }}
                                onChange={e => {
                                    const selectedValue = e.target.value
                                    setStatus(selectedValue === 'All' ? '' : selectedValue)
                                }}
                            >
                                <MenuItem disabled value={' '}>
                                    <em>Status</em>
                                </MenuItem>
                                <MenuItem value={'All'}>All</MenuItem>
                                <MenuItem value={'active'}>Active</MenuItem>
                                <MenuItem value={'inactive'}>Inactive</MenuItem>
                            </Select>
                            <TextField
                                type="search"
                                size='small'
                                placeholder='Search'
                                onChange={handleSearchChange}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ p: 5 }}>
                        <TableHelps
                            search={search}
                            loading={loading}
                            rows={helpsdata}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            toggleDelete={toggleConfirmationDialog}
                            toggleEdit={toggleFaqsFormDialog}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid>

        {/* testimonial dialogs*/}
        <DialogFormHelp
            mode={helpsFormDialogMode}
            open={helpsFormDialogOpen}
            toggle={toggleFaqsFormDialog}
            dataToEdit={helpsToEdit}
            onSuccess={() => {
                fetchData({
                    currentPage: currentPage,
                    pageSize: pageSize,
                });
            }}
        />


        <DialogConfirmation
            loading={confirmationDialogLoading}
            title="Delete Helps"
            subtitle="Are you sure you want to delete this Helps?"
            open={confirmationDialogOpen}
            toggle={toggleConfirmationDialog}
            onConfirm={onConfirmDelete}
        />

    </>
}

export default HelpPage