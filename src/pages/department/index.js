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
import DialogDepartment from "src/views/dialog/DialogDepartment";
import TableDepartment from "src/views/tables/TableDepartment";
import TableDegree from "src/views/tables/TableDegree";
import DialogDegree from "src/views/dialog/DialogDegree";
import { IdeogramCjkVariant } from "mdi-material-ui";
import { useAuth } from "src/hooks/useAuth";


const Department = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { rolePremission, isMasterAdmin } = useAuth()
    //pagination
    const [search, setSearch] = useState("");
    const [totalDeptCount, setTotalDeptCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    //pagination
    const [totalDegreeCount, setTotalDegreeCount] = useState(0);
    const [currentDegreePage, setCurrentDegreePage] = useState(1);
    const [degreePageSize, setDegreePageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    // Testimonials for Department
    const [departmentData, setDepartmentData] = useState([])
    const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
    const [departmentDialogMode, setDepartmentDialogMode] = useState("add");
    const [departmentToEdit, setDepartmentToEdit] = useState(null);
    const [selectedCellId, setSelectedCellId] = useState(null);
    const toggleDepartmentDialog = (e, mode = 'add', DepartmentToEdit = null) => {
        setDepartmentDialogOpen(prev => !prev);
        setDepartmentDialogMode(mode);
        setDepartmentToEdit(DepartmentToEdit);
    };

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [deptdegreeToDelete, setDeptDegreeToDelete] = useState(null);
    const [type, setType] = useState('');

    const toggleConfirmationDialog = (e, deptToDelete = null, type) => {
        console.log("type", type)
        setConfirmationDialogOpen((prev) => !prev);
        setDeptDegreeToDelete(deptToDelete);
        setType(type)
    };
    // Testimonials for Degree
    const [degreeData, setDegreeData] = useState([])
    const [degreeDialogOpen, setDegreeDialogOpen] = useState(false);
    const [degreeDialogMode, setDegreeDialogMode] = useState("add");
    const [degreeToEdit, setDegreeToEdit] = useState(null);
    const [deptId, setDeptId] = useState(null)

    const toggleDegreeDialog = (e, mode = 'add', DegreeToEdit = null) => {
        setDegreeDialogOpen(prev => !prev);
        setDegreeDialogMode(mode);
        setDegreeToEdit(DegreeToEdit);
    };
    const handleCellClick = (id) => {
        setSelectedCellId(id);
        fetchDegreeData(id);
    };

    const fetchDepartmentData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };
        axiosInstance
            .get(ApiEndPoints.DEPARTMENT.get, { params })
            .then((response) => {
                setDepartmentData(response?.data?.data?.departments);
                setDeptId(response?.data?.data?.departments[0]?.deptId)
                setTotalDeptCount(response?.data?.data?.total)
                console.log("Department_List response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchDegreeData = () => {
        setLoading(true);
        let params = {
            page: currentDegreePage,  // ✅ Use correct pagination state
            limit: degreePageSize,    // ✅ Use correct pagination state
            search: search
        };

        axiosInstance
            .get(ApiEndPoints.DEGREE.get, { params })
            .then((response) => {
                setDegreeData(response?.data?.data?.degreesList);
                setTotalDegreeCount(response.data.data.total);  // ✅ Corrected total count update
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };



    useEffect(() => {
        fetchDepartmentData({
            currentPage: currentPage,
            pageSize: degreePageSize,
            search: search,
        });
    }, [currentPage, pageSize, search])

    useEffect(() => {
        fetchDegreeData({
            currentPage: currentDegreePage,
            pageSize: degreePageSize,
            search: search,
        });
    }, [currentDegreePage, degreePageSize, search]);

    // useEffect(() => {
    //     // if (deptId) {
    //     fetchDegreeData({
    //         currentPage: currentPage,
    //         pageSize: pageSize,
    //         search: search,
    //     });
    //     // }
    // }, [currentPage, pageSize, search]);


    const updatedRows = departmentData.map((row) => ({
        ...row,
        selected: row.id === selectedCellId, // Add a selected flag to highlight the row
    }));

    const onConfirmDeleteDepartmentDetail = useCallback(
        (e) => {
            e?.preventDefault();
            setConfirmationDialogLoading(true);

            const apiEndpoint =
                type === "dept"
                    ? ApiEndPoints.DEPARTMENT.delete(deptdegreeToDelete?.deptId)
                    : ApiEndPoints.DEGREE.delete(deptdegreeToDelete?.degreeId);

            axiosInstance
                .delete(apiEndpoint)
                .then((response) => response.data)
                .then((response) => {
                    if (type === 'dept') {
                        fetchDepartmentData({
                            currentPage: currentPage,
                            pageSize: pageSize,
                            search: search,
                        });
                    } else {
                        fetchDegreeData({
                            currentPage: currentDegreePage,
                            pageSize: degreePageSize,
                            search: search,
                        });
                    }
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
        [currentPage, deptdegreeToDelete, pageSize, search, type] // Added `type` dependency
    );

    console.log("deptdegreeToDelete", deptdegreeToDelete)
    return (
        <>
            <Grid container spacing={4} className="match-height">
                <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="Department" />
                        </Typography>
                    }
                    action={
                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'dept.create'
                        ) || isMasterAdmin === true) ? (
                            <Button variant="contained"
                                onClick={toggleDepartmentDialog}
                            >
                                Add Department
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
                        </Box>
                        <Box>
                            <Box sx={{ p: 5 }}>
                                <TableDepartment
                                    search={search}
                                    loading={loading}
                                    rows={updatedRows}
                                    totalCount={totalDeptCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    toggleEdit={toggleDepartmentDialog}
                                    handleCellClick={handleCellClick}
                                    selectedCellId={selectedCellId}
                                    rolePremission={rolePremission}
                                    isMasterAdmin={isMasterAdmin}
                                    toggleDelete={toggleConfirmationDialog}
                                />
                            </Box>

                        </Box>
                    </Card>

                </Grid>
            </Grid>

            <Grid container spacing={4} className="match-height" mt={20}>
                <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="Degree" />
                        </Typography>
                    }

                    action={
                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'degree.create'
                        ) || isMasterAdmin === true) ? (
                            <Button variant="contained"
                                onClick={toggleDegreeDialog}
                            >
                                Add Degree
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
                        </Box>
                        <Box>
                            <Box sx={{ p: 5 }}>
                                <TableDegree
                                    search={search}
                                    loading={loading}
                                    rows={degreeData}
                                    departmentData={departmentData}
                                    totalCount={totalDegreeCount}
                                    setCurrentPage={setCurrentDegreePage}
                                    currentPage={currentDegreePage}
                                    setPageSize={setDegreePageSize}
                                    pageSize={degreePageSize}
                                    toggleEdit={toggleDegreeDialog}
                                    rolePremission={rolePremission}
                                    isMasterAdmin={isMasterAdmin}
                                    toggleDelete={toggleConfirmationDialog}
                                />

                            </Box>

                        </Box>
                    </Card>

                </Grid>
            </Grid>


            <DialogDepartment
                mode={departmentDialogMode}
                open={departmentDialogOpen}
                toggle={toggleDepartmentDialog}
                dataToEdit={departmentToEdit}
                onSuccess={() => {
                    fetchDepartmentData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />

            <DialogDegree
                mode={degreeDialogMode}
                open={degreeDialogOpen}
                toggle={toggleDegreeDialog}
                dataToEdit={degreeToEdit}
                departmentData={departmentData}
                onSuccess={() => {
                    fetchDegreeData(deptId)
                }}
            />

            <DialogConfirmation
                loading={confirmationDialogLoading}
                title={type === 'dept' ? "Delete Department" : 'Delete Degree'}
                subtitle={`Are you sure you want to delete this ${type === 'dept' ? 'Department' : 'Degree'}?`}
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDeleteDepartmentDetail}
            />

        </>
    )
}
export default Department