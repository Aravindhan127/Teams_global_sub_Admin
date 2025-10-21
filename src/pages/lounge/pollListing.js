import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Translations from "src/layouts/components/Translations";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import DialogStatus from "src/views/dialog/DialogStatus";
import DialogApproveReject from "src/views/dialog/DialogApproveReject";
import TablePoll from "src/views/tables/TablePoll";
import DialogPoll from "src/views/dialog/DialogPoll";


const PollListing = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { rolePremission, isMasterAdmin } = useAuth()

    // status dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        setStatusDialogOpen((prev) => !prev);
        setStatusToUpdate(statusToUpdate);
    };

    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);


    // Testimonials for poll
    const [pollData, setPollData] = useState([])
    const [pollDialogOpen, setPollDialogOpen] = useState(false);
    const [pollDialogMode, setPollDialogMode] = useState("add");
    const [pollToEdit, setPollToEdit] = useState(null);

    const [role, setRole] = useState([])
    const togglePollDialog = (e, mode = 'add', pollToEdit = null) => {
        setPollDialogOpen(prev => !prev);
        setPollDialogMode(mode);
        setPollToEdit(pollToEdit);
    };

    // const fetchpollData = () => {
    //     setLoading(true);
    //     axiosInstance
    //         .get(ApiEndPoints?.poll?.list)
    //         .then((response) => {
    //             setPollData(response?.data?.data?.pollList);
    //             setTotalCount(response?.data.total)
    //             console.log("poll response--------------------", response);
    //         })
    //         .catch((error) => {
    //             toastError(error);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // };

    // useEffect(() => {
    //     fetchpollData({
    //         currentPage: currentPage,
    //         pageSize: pageSize,
    //         search: search,
    //     });
    // }, [currentPage, pageSize, search])

    return (
        <>
            <Grid container spacing={4} className="match-height">
                <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="Poll" />
                        </Typography>
                    }
                    action={
                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'orgpoll.create'
                        ) || isMasterAdmin === true) ? (
                            <Button variant="contained"
                                onClick={togglePollDialog}
                            >
                                Create poll
                            </Button>
                        ) : null
                    }

                />
                <Grid item xs={12}>
                    <Card>
                        <Box>
                            <Box sx={{ p: 5 }}>
                                <TablePoll
                                    search={search}
                                    loading={loading}
                                    rows={pollData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    // toggleEdit={togglePollDialog}
                                    toggleStatus={toggleChangeStatusDialog}
                                // rolePremission={rolePremission}
                                // isMasterAdmin={isMasterAdmin}
                                // toggleDelete={toggleChangeStatusDialog}
                                />
                            </Box>

                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <DialogPoll
                open={pollDialogOpen}
                toggle={togglePollDialog}
                mode={pollDialogMode}
                dataToEdit={pollToEdit}
                role={role}
            // onSuccess={() => {
            //     fetchpollData({
            //         currentPage: currentPage,
            //         pageSize: pageSize,
            //     });
            // }}
            />

            {/* <DialogApproveReject
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="poll"
                onSuccess={() => {
                    fetchpollData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search,
                    });
                }}
            /> */}
        </>
    )
}
export default PollListing