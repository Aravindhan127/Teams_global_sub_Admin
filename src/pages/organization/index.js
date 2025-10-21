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
import DialogStatus from "src/views/dialog/DialogStatus";
import TableOrganizationUser from "src/views/tables/TableOrganizationUser";
import DialogRejectReason from "src/views/dialog/DialogRejectRequest";
import { useAuth } from "src/hooks/useAuth";

const OrganizationUser = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [organizationData, setOrganizationData] = useState([])
    const { rolePremission, isMasterAdmin } = useAuth()
    const searchTimeoutRef = useRef()
    // status dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    // const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
    //     setStatusDialogOpen((prev) => !prev);
    //     // if (statusToUpdate?.isActive) {
    //     setStatusToUpdate(statusToUpdate);
    //     // }
    // };

    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        e.preventDefault(); // Prevents default behavior if called from a button

        if (!statusToUpdate) return; // Ensure statusToUpdate is provided

        let payload = {
            userSeqId: statusToUpdate?.userSeqId,
        };
        setLoading(true);
        axiosInstance
            .post(ApiEndPoints.ORGANIZATION_USER.active_deactive, payload)
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
    const [rejectOrgDialogOpen, setRejectOrgDialogOpen] = useState(false);
    const [rejectOrgId, setRejectOrgId] = useState(null);

    const toggleRejectOrgReq = (id) => {
        setRejectOrgDialogOpen((prev) => !prev);
        setRejectOrgId(id)
    }
    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [organizationToDelete, setOrganizationToDelete] = useState(null);

    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    const toggleConfirmationDialog = (e, organizationToDelete = null) => {
        setConfirmationDialogOpen((prev) => !prev);
        setOrganizationToDelete(organizationToDelete);
    };

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search || null,
            userType: null
        };

        axiosInstance
            .get(ApiEndPoints.ORGANIZATION_USER.get_organization_users, { params })
            .then((response) => {
                setOrganizationData(response?.data?.data?.users);
                setTotalCount(response?.data?.data?.totalUsers)
                console.log("organization_List response--------------------", response?.data?.data?.totalUsers);
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

    const handleAction = (type, id) => {

        if (type === 'approve') {
            const payload = { userSeqId: id };

            setLoading(true);
            axiosInstance
                .post(ApiEndPoints.ORGANIZATION_USER.accept, payload)
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
            setRejectOrgId(id);
            setRejectOrgDialogOpen(true);
        }
    };
    const onConfirmDeleteCollegeDetail = useCallback(
        (e) => {
            e?.preventDefault();
            setConfirmationDialogLoading(true);
            axiosInstance
                .delete(ApiEndPoints.COLLEGE_USER.delete_by_id(organizationToDelete?.personId))
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
        [currentPage, organizationToDelete, pageSize, search]
    );

    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }
    return (
        <>
            <Grid container spacing={4} className="match-height">
                {/* <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="Organization User" />
                        </Typography>
                    }

                /> */}
                <Grid item xs={12}>
                    <Card>
                        <Box sx={{ p: 5 }}>
                            <TableOrganizationUser
                                search={search}
                                loading={loading}
                                rows={organizationData}
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
                open={rejectOrgDialogOpen}
                toggle={toggleRejectOrgReq}
                id={rejectOrgId}
                type={"org"}
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
                type="orgUser"
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            /> */}

            <DialogConfirmation
                loading={confirmationDialogLoading}
                title="Delete user"
                subtitle="Are you sure you want to delete this user?"
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDeleteCollegeDetail}
            />
        </>
    )
}
export default OrganizationUser