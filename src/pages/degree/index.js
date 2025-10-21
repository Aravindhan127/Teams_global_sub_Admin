// import { useEffect, useState, useRef, useCallback } from "react";
// import { Button, Grid, Typography } from "@mui/material";
// import Card from "@mui/material/Card";
// import Box from "@mui/material/Box";
// import Translations from "src/layouts/components/Translations";
// import PageHeader from "src/@core/components/page-header";
// import { DefaultPaginationSettings } from "src/constants/general.const";
// import { axiosInstance } from "src/network/adapter";
// import { ApiEndPoints } from "src/network/endpoints";
// import { toastError, toastSuccess } from "src/utils/utils";
// import DialogConfirmation from "src/views/dialog/DialogConfirmation";
// import { useNavigate, useParams } from "react-router-dom";
// import DialogStatus from "src/views/dialog/DialogStatus";
// import DialogDegree from "src/views/dialog/DialogDegree";
// import TableDegree from "src/views/tables/TableDegree";


// const Degree = () => {
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(false);

//     const params = useParams()
//     const deptId = params?.deptId
//     //pagination
//     const [search, setSearch] = useState("");
//     const [totalCount, setTotalCount] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);


//     // Testimonials for Degree
//     const [degreeData, setDegreeData] = useState([])
//     const [degreeDialogOpen, setDegreeDialogOpen] = useState(false);
//     const [degreeDialogMode, setDegreeDialogMode] = useState("add");
//     const [degreeToEdit, setDegreeToEdit] = useState(null);

//     const toggleDegreeDialog = (e, mode = 'add', DegreeToEdit = null) => {
//         setDegreeDialogOpen(prev => !prev);
//         setDegreeDialogMode(mode);
//         setDegreeToEdit(DegreeToEdit);
//     };

//     const fetchDegreeData = ({ currentPage, search }) => {
//         setLoading(true);
//         let params = {
//             page: currentPage,
//             search: search
//         };

//         axiosInstance
//             .get(ApiEndPoints.DEGREE.get(deptId), { params })
//             .then((response) => {
//                 setDegreeData(response?.data?.data?.degreesList);
//                 setTotalCount(response.data.total)
//                 console.log("Degree_List response--------------------", response);
//             })
//             .catch((error) => {
//                 toastError(error);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     useEffect(() => {
//         fetchDegreeData({
//             currentPage: currentPage,
//             pageSize: pageSize,
//             search: search,
//         });
//     }, [currentPage, pageSize, search])


//     return (
//         <>
//             <Grid container spacing={4} className="match-height">
//                 <PageHeader
//                     title={
//                         <Typography variant="h5">
//                             <Translations text="Degree" />
//                         </Typography>
//                     }
//                     action={
//                         <Button variant="contained"
//                             onClick={toggleDegreeDialog}
//                         >
//                             Add Degree
//                         </Button>
//                     }
//                 />
//                 <Grid item xs={12}>
//                     <Card>
//                         <Box
//                             sx={{
//                                 p: 5,
//                                 pb: 0,
//                                 display: "flex",
//                                 flexWrap: "wrap",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                             }}
//                         >
//                         </Box>
//                         <Box>
//                             <Box sx={{ p: 5 }}>
//                                 <TableDegree
//                                     search={search}
//                                     loading={loading}
//                                     rows={degreeData}
//                                     totalCount={totalCount}
//                                     setCurrentPage={setCurrentPage}
//                                     currentPage={currentPage}
//                                     setPageSize={setPageSize}
//                                     pageSize={pageSize}
//                                     toggleEdit={toggleDegreeDialog}
//                                     toggleStatus={toggleChangeStatusDialog}
//                                 // toggleDelete={toggleChangeStatusDialog}
//                                 />
//                             </Box>

//                         </Box>
//                     </Card>

//                 </Grid>
//             </Grid>


//             <DialogDegree
//                 mode={degreeDialogMode}
//                 open={degreeDialogOpen}
//                 toggle={toggleDegreeDialog}
//                 dataToEdit={degreeToEdit}
//                 onSuccess={() => {
//                     fetchDegreeData({
//                         currentPage: currentPage,
//                         pageSize: pageSize,
//                     });
//                 }}
//             />

//         </>
//     )
// }
// export default Degree