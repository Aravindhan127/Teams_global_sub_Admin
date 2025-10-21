import { useEffect, useState, useRef, useCallback } from "react"
import { Button, Grid, Typography } from "@mui/material"
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
import DialogFormHubAddress from "src/views/dialog/DialogFormHubAddress"
import TableSizeChart from "src/views/tables/TableSizeChart"
import DialogFormSizeChart from "src/views/dialog/DialogFormSizeChart"

const SizechartPage = () => {

    const searchTimeoutRef = useRef();

    const [loading, setLoading] = useState(false);

    const [sizeChartdata, setSizechartData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    // Testimonials
    const [sizechartDialogOpen, setSizechartDialogOpen] = useState(false);
    const [sizechartDialogMode, setSizechartDialogMode] = useState("add");
    const [sizechartToEdit, setSizechartToEdit] = useState(null);

    const toggleSizechartFormDialog = (e, mode = "add", sizechartToEdit = null) => {
        setSizechartDialogOpen(prev => !prev);
        setSizechartDialogMode(mode);
        setSizechartToEdit(sizechartToEdit);
    }

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [hubToDelete, setHubToDelete] = useState(null);

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setHubToDelete(dataToDelete)
    }



    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };

        axiosInstance
            .get(ApiEndPoints.SIZE_CHART.list, { params })
            .then((response) => {
                setSizechartData(response.data.data.sizechart)
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
        });
    }, [currentPage, pageSize, search])

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
            .delete(ApiEndPoints.SIZE_CHART.delete(hubToDelete._id))
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
    }, [currentPage, hubToDelete, pageSize, search])

    return <>
        <Grid container spacing={4} className="match-height">
            <PageHeader
                title={
                    <Typography variant="h5">
                        <Translations text="Size Chart" />
                    </Typography>
                }
                action={
                    <Button variant="contained" onClick={toggleSizechartFormDialog}>
                        Add Size Chart
                    </Button>
                }
            />
            <Grid item xs={12}>
                <Card>
                    <Box sx={{ p: 5, pb: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box></Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                            <TextField
                                type="search"
                                size='small'
                                // value={search}
                                placeholder='Search'
                                // onChange={e => setSearch(e.target.value)}
                                onChange={handleSearchChange}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ p: 5 }}>
                        <TableSizeChart
                            search={search}
                            loading={loading}
                            rows={sizeChartdata}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            toggleDelete={toggleConfirmationDialog}
                            toggleEdit={toggleSizechartFormDialog}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid>


        <DialogFormSizeChart
            mode={sizechartDialogMode}
            open={sizechartDialogOpen}
            toggle={toggleSizechartFormDialog}
            dataToEdit={sizechartToEdit}
            onSuccess={() => {
                fetchData({
                    currentPage: currentPage,
                    pageSize: pageSize,
                });
            }}
        />


        <DialogConfirmation
            loading={confirmationDialogLoading}
            title="Delete Hub Address"
            subtitle="Are you sure you want to delete this Hub Address?"
            open={confirmationDialogOpen}
            toggle={toggleConfirmationDialog}
            onConfirm={onConfirmDelete}
        />

    </>
}

export default SizechartPage