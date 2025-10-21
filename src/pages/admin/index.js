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
import DialogConfirmation from "src/views/dialog/DialogConfirmation";
import { useNavigate } from "react-router-dom";
import DialogStatus from "src/views/dialog/DialogStatus";
import TableAdmin from "src/views/tables/TableAdmin";
import DialogAdmin from "src/views/dialog/DialogAdmin";
import { useAuth } from "src/hooks/useAuth";


const Admin = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { rolePremission, isMasterAdmin } = useAuth()
    // status dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    // const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
    //     setStatusDialogOpen((prev) => !prev);
    //     setStatusToUpdate(statusToUpdate);
    // };
    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        e.preventDefault(); // Prevents default behavior if called from a button

        if (!statusToUpdate) return; // Ensure statusToUpdate is provided

        let payload = {
            orgAdminId: statusToUpdate?.orgAdminId,
        };
        setLoading(true);
        axiosInstance
            .post(ApiEndPoints.ADMIN.active_deactive(statusToUpdate?.orgAdminId), payload)
            .then((response) => {
                toastSuccess(response.data.message);
                fetchAdminData({
                    currentPage: currentPage,
                    pageSize: pageSize,
                    search: search,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);


    // Testimonials for Admin
    const [adminData, setAdminData] = useState([])
    const [role, setRole] = useState([])
    const [adminDialogOpen, setAdminDialogOpen] = useState(false);
    const [adminDialogMode, setAdminDialogMode] = useState("add");
    const [adminToEdit, setAdminToEdit] = useState(null);

    const toggleAdminDialog = (e, mode = 'add', adminToEdit = null) => {
        setAdminDialogOpen(prev => !prev);
        setAdminDialogMode(mode);
        setAdminToEdit(adminToEdit);
    };

    const fetchAdminData = () => {
        setLoading(true);

        axiosInstance
            .get(ApiEndPoints?.ADMIN?.get)
            .then((response) => {
                setAdminData(response?.data?.admins);
                setTotalCount(response?.data.total)
                console.log("ADMIN response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    const fetchRoleData = () => {
        setLoading(true);

        axiosInstance
            .get(ApiEndPoints?.ROLES?.getRoles)
            .then((response) => {
                setRole(response?.data?.data.map((item, index) => item));
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };
    useEffect(() => {
        fetchAdminData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
        });
    }, [currentPage, pageSize, search])

    useEffect(() => {
        fetchRoleData();
    }, [])


    return (
        <>
            <Grid container spacing={4} className="match-height">
                <PageHeader
                    // title={
                    //     <Typography variant="h5">
                    //         <Translations text="App Admin" />
                    //     </Typography>
                    // }
                    action={
                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'subadmin.create'
                        ) || isMasterAdmin === true) ? (
                            <Button
                                variant="contained"
                                onClick={toggleAdminDialog}
                            >
                                Add App Admin
                            </Button>
                        ) : null
                    }
                />
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                        <Box
                            sx={{
                                p: 5,
                                pb: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box></Box>
                        </Box>
                        <Box>
                            <Box sx={{ p: 5 }}>
                                <TableAdmin
                                    search={search}
                                    loading={loading}
                                    rows={adminData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    toggleEdit={toggleAdminDialog}
                                    toggleStatus={toggleChangeStatusDialog}
                                    rolePremission={rolePremission}
                                    isMasterAdmin={isMasterAdmin}
                                // toggleDelete={toggleChangeStatusDialog}
                                />
                            </Box>

                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <DialogAdmin
                open={adminDialogOpen}
                toggle={toggleAdminDialog}
                mode={adminDialogMode}
                dataToEdit={adminToEdit}
                role={role}
                onSuccess={() => {
                    fetchAdminData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />

            {/* <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="admin"
                onSuccess={() => {
                    fetchAdminData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            /> */}
        </>
    )
}
export default Admin