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

const TestimonialsPage = () => {

    const searchTimeoutRef = useRef();

    const [loading, setLoading] = useState(false);

    const [testimonialsdata, setTestimonialsData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);
    const [status, setStatus] = useState('')

    // Testimonials
    const [testimonialFormDialogOpen, setTestimonialFormDialogOpen] = useState(false);
    const [testimonialFormDialogMode, setTestimonialFormDialogMode] = useState("add");
    const [testimonialToEdit, setTestimonialToEdit] = useState(null);

    const toggleTestimonialFormDialog = (e, mode = "add", planServiceToEdit = null) => {
        setTestimonialFormDialogOpen(prev => !prev);
        setTestimonialFormDialogMode(mode);
        setTestimonialToEdit(planServiceToEdit);
    }

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState(null);

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setTestimonialToDelete(dataToDelete)
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
            .get(ApiEndPoints.Testimonials.list, { params })
            .then((response) => {
                setTestimonialsData(response.data.data.testimonial)
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
            .delete(ApiEndPoints.Testimonials.delete(testimonialToDelete._id))
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
    }, [currentPage, testimonialToDelete, pageSize, search])

    return <>
        <Grid container spacing={4} className="match-height">
            <PageHeader
                title={
                    <Typography variant="h5">
                        <Translations text="Testimonials" />
                    </Typography>
                }
                action={
                    <Button variant="contained" onClick={toggleTestimonialFormDialog}>
                        Add Testimonials
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
                        <TableTestimonials
                            search={search}
                            loading={loading}
                            rows={testimonialsdata}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            toggleDelete={toggleConfirmationDialog}
                            toggleEdit={toggleTestimonialFormDialog}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid>

        {/* testimonial dialogs*/}
        <DialogFormTestimonial
            mode={testimonialFormDialogMode}
            open={testimonialFormDialogOpen}
            toggle={toggleTestimonialFormDialog}
            dataToEdit={testimonialToEdit}
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

export default TestimonialsPage