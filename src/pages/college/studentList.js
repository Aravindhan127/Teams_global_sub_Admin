import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Translations from "src/layouts/components/Translations";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import DialogConfirmation from "src/views/dialog/DialogConfirmation";
import { useNavigate } from "react-router-dom";
import TableCollegeUser from "src/views/tables/TableCollegeUser";
import DialogStatus from "src/views/dialog/DialogStatus";
import DialogRejectReason from "src/views/dialog/DialogRejectRequest";
import { useAuth } from "src/hooks/useAuth";

const StudentsList = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [collegeData, setCollegeData] = useState([])
    const searchTimeoutRef = useRef()

    // status dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    // const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
    //     // console.log("statusToUpdate", statusToUpdate)
    //     // setStatusDialogOpen((prev) => !prev);
    //     // // if (statusToUpdate?.isActive) {
    //     // setStatusToUpdate(statusToUpdate);
    //     // 
    // };

    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        e.preventDefault(); // Prevents default behavior if called from a button

        if (!statusToUpdate) return; // Ensure statusToUpdate is provided

        let payload = {
            userSeqId: statusToUpdate?.userSeqId,
        };
        setLoading(true);
        axiosInstance
            .post(ApiEndPoints.COLLEGE_USER.active_deactive, payload)
            .then((response) => {
                toastSuccess(response.data.message);
                fetchData({
                    currentPage: currentPage,
                    pageSize: pageSize,
                    search: search,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };


    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [collegeToDelete, setCollegeToDelete] = useState(null);
    const { rolePremission, isMasterAdmin } = useAuth()

    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    const toggleConfirmationDialog = (e, collegeToDelete = null) => {
        setConfirmationDialogOpen((prev) => !prev);
        setCollegeToDelete(collegeToDelete);
    };

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);

    const toggleRejectReq = (id) => {
        setRejectDialogOpen((prev) => !prev);
        setRejectId(id)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search || null,
            userType: "student"
        };

        axiosInstance
            .get(ApiEndPoints.COLLEGE_USER.get_college_users, { params })
            .then((response) => {
                setCollegeData(response?.data?.data?.users);
                setTotalCount(response?.data?.data?.totalUsers)
                console.log("college_List response--------------------", response);
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

    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }

    const handleAction = (type, id) => {
        if (type === 'approve') {
            const payload = { userSeqId: id };

            setLoading(true);
            axiosInstance
                .post(ApiEndPoints.COLLEGE_USER.accept, payload)
                .then((response) => {
                    toastSuccess(response.data.message);
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search,
                    });
                })
                .catch((error) => {
                    toastError(error.message || 'Something went wrong');
                })
                .finally(() => setLoading(false));
        } else if (type === 'reject') {
            // Open the dialog and set the ID for rejection
            setRejectId(id);
            setRejectDialogOpen(true);
        }
    };
    const onConfirmDeleteCollegeDetail = useCallback(
        (e) => {
            e?.preventDefault();
            setConfirmationDialogLoading(true);
            axiosInstance
                .delete(ApiEndPoints.COLLEGE_USER.delete_by_id(collegeToDelete?.personId))
                .then((response) => response.data)
                .then((response) => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search,
                    });
                    toggleConfirmationDialog();
                    toastSuccess(response.message);
                    console.log("response", response);
                })
                .catch((error) => {
                    toastError(error);
                })
                .finally(() => {
                    setConfirmationDialogLoading(false);
                });
        },
        [currentPage, collegeToDelete, pageSize, search]
    );
    return (
        <>
            <Grid container spacing={4} className="match-height">
                {/* <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="College User" />
                        </Typography>
                    }
                /> */}
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                        {/* <Box
                            sx={{
                                p: 5,
                                pb: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "fle x-end",
                            }}
                        >
                            <Box>  <TextField type='search' size='small' placeholder='Search' onChange={handleSearchChange} /></Box>
                        </Box> */}
                        <Box sx={{ p: 5, mt: 5 }}>
                            <TableCollegeUser
                                search={search}
                                loading={loading}
                                rows={collegeData}
                                type="student"
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleDelete={toggleConfirmationDialog}
                                toggleApproveReject={handleAction}
                                toggleStatus={toggleChangeStatusDialog}
                                rolePremission={rolePremission}
                                isMasterAdmin={isMasterAdmin}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>


            <DialogRejectReason
                open={rejectDialogOpen}
                toggle={toggleRejectReq}
                id={rejectId}
                type={"college"}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search,
                    })
                }}
            />

            {/* <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="collegeUser"
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            /> */}


            <DialogConfirmation
                loading={confirmationDialogLoading}
                title="Delete college user"
                subtitle="Are you sure you want to delete this user?"
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDeleteCollegeDetail}
            />
        </>
    )
}
export default StudentsList