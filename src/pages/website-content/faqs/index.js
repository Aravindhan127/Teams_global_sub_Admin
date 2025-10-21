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
import TableTestimonials from "src/views/tables/TableTestimonials"
import DialogFormTestimonial from "src/views/dialog/DialogFormTestimonial"
import TableFaqs from "src/views/tables/TableFaqs"
import DialogFormFaqs from "src/views/dialog/DialogFormFaqs"

const FaqsPage = () => {

    const searchTimeoutRef = useRef();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const [faqsdata, setFaqsData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    // Testimonials
    const [faqsFormDialogOpen, setFaqsFormDialogOpen] = useState(false);
    const [faqsFormDialogMode, setFaqsFormDialogMode] = useState("add");
    const [faqsToEdit, setFaqsToEdit] = useState(null);

    const toggleFaqsFormDialog = (e, mode = "add", faqsToEdit = null) => {
        setFaqsFormDialogOpen(prev => !prev);
        setFaqsFormDialogMode(mode);
        setFaqsToEdit(faqsToEdit);
    }

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [FaqsToDelete, setFaqsToDelete] = useState(null);

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setFaqsToDelete(dataToDelete)
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
            .get(ApiEndPoints.FAQ.list, { params })
            .then((response) => {
                setFaqsData(response.data.data.faqs)
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
            .delete(ApiEndPoints.FAQ.delete(FaqsToDelete._id))
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
    }, [currentPage, FaqsToDelete, pageSize, search])

    return <>
        <Grid container spacing={4} className="match-height">
            <PageHeader
                title={
                    <Typography variant="h5">
                        <Translations text="FAQS" />
                    </Typography>
                }
                action={
                    <Button variant="contained" onClick={toggleFaqsFormDialog}>
                        Add FAQS
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
                        <TableFaqs
                            search={search}
                            loading={loading}
                            rows={faqsdata}
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
        <DialogFormFaqs
            mode={faqsFormDialogMode}
            open={faqsFormDialogOpen}
            toggle={toggleFaqsFormDialog}
            dataToEdit={faqsToEdit}
            onSuccess={() => {
                fetchData({
                    currentPage: currentPage,
                    pageSize: pageSize,
                });
            }}
        />


        <DialogConfirmation
            loading={confirmationDialogLoading}
            title="Delete Testimonials"
            subtitle="Are you sure you want to delete this Testimonials?"
            open={confirmationDialogOpen}
            toggle={toggleConfirmationDialog}
            onConfirm={onConfirmDelete}
        />

    </>
}

export default FaqsPage