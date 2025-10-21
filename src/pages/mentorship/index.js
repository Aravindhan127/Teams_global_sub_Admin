// import { useEffect, useState, useRef, useCallback } from "react";
// import { Button, CardContent, Grid, Tab, TextField, Typography, Fade } from "@mui/material";
// import Card from "@mui/material/Card";
// import Box from "@mui/material/Box";
// import Translations from "src/layouts/components/Translations";
// import PageHeader from "src/@core/components/page-header";
// import { DefaultPaginationSettings } from "src/constants/general.const";
// import { axiosInstance } from "src/network/adapter";
// import { ApiEndPoints } from "src/network/endpoints";
// import { toastError, toastSuccess } from "src/utils/utils";
// import DialogConfirmation from "src/views/dialog/DialogConfirmation";
// import { useNavigate } from "react-router-dom";
// import DialogStatus from "src/views/dialog/DialogStatus";
// import DialogChapter from "src/views/dialog/DialogChapter";
// import TableChapter from "src/views/tables/TableChapter";
// import { useAuth } from "src/hooks/useAuth";
// import TableMentorship from "src/views/tables/TableMentorship";
// import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';
// import mentor from "../../assets/images/mentor.svg"
// import { TabContext, TabList, TabPanel } from "@mui/lab";

// const Mentorship = () => {
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(false);
//     const { rolePremission, isMasterAdmin } = useAuth()
//     const [value, setValue] = useState("approved");
//     const searchTimeoutRef = useRef(null);
//     // status dialog
//     // const [statusDialogOpen, setStatusDialogOpen] = useState(false);
//     // const [statusToUpdate, setStatusToUpdate] = useState(null);

//     // const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
//     //     setStatusDialogOpen((prev) => !prev);
//     //     setStatusToUpdate(statusToUpdate);
//     // };

//     //pagination
//     const [search, setSearch] = useState("");
//     const [totalCount, setTotalCount] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);


//     // Testimonials for chapter
//     const [mentorshipData, setMentorshipData] = useState([])
//     // const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
//     // const [chapterDialogMode, setChapterDialogMode] = useState("add");
//     // const [chapterToEdit, setChapterToEdit] = useState(null);

//     // const [role, setRole] = useState([])
//     // const toggleChapterDialog = (e, mode = 'add', chapterToEdit = null) => {
//     //     setChapterDialogOpen(prev => !prev);
//     //     setChapterDialogMode(mode);
//     //     setChapterToEdit(chapterToEdit);
//     // };

//     // const fetchmentorshipData = () => {
//     //     setLoading(true);
//     //     axiosInstance
//     //         .get(ApiEndPoints?.CHAPTER?.get)
//     //         .then((response) => {
//     //             setMentorshipData(response?.data?.data?.chapters);
//     //             setTotalCount(response?.data.total)
//     //             console.log("chapter response--------------------", response);
//     //         })
//     //         .catch((error) => {
//     //             toastError(error);
//     //         })
//     //         .finally(() => {
//     //             setLoading(false);
//     //         });
//     // };

//     // useEffect(() => {
//     //     fetchmentorshipData({
//     //         currentPage: currentPage,
//     //         pageSize: pageSize,
//     //         search: search,
//     //     });
//     // }, [currentPage, pageSize, search])
//     const handleChange = (event, newValue) => {
//         setValue(newValue); // Update selected tab
//         // fetchLoungeData({ currentPage, pageSize, loungeType: newValue }); 
//     };
//     const handleSearchChange = (e) => {
//         if (searchTimeoutRef.current) {
//             clearTimeout(searchTimeoutRef.current);
//         }
//         searchTimeoutRef.current = setTimeout(() => {
//             setSearch(e.target.value);
//         }, 500);
//     };
//     return (
//         <>
//             <Grid container spacing={6} className="match-height">
//                 <Grid item xs={12}>
//                     <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
//                         <CardContent>
//                             <Grid container spacing={4}>
//                                 <Grid item xs={12} sx={{ display: "flex", gap: 5, alignItems: "center", justifyContent: "space-between" }}>
//                                     <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
//                                         <img src={mentor} style={{ width: "60px", height: "60px" }} />
//                                         <Typography variant="fm-h6" sx={{ fontWeight: 600, color: "#656565" }}>Mentor List</Typography>
//                                     </Box>

//                                     <Box sx={{ width: "457px", display: "flex", }}>
//                                         <TextField
//                                             placeholder="Search Mentor..."
//                                             variant="standard"
//                                             size="medium"
//                                             type="search"
//                                             InputProps={{
//                                                 disableUnderline: true,
//                                                 startAdornment: (
//                                                     <SearchIcon sx={{ color: "#888", mr: 1, fontSize: "30px" }} />
//                                                 ),
//                                                 sx: { fontSize: '14px' }
//                                             }}
//                                             sx={{ bgcolor: "#FAFAFA", borderRadius: "10px", py: 2, px: 1 }}
//                                             fullWidth
//                                             onChange={handleSearchChange}
//                                         />
//                                     </Box>

//                                     <Box sx={{ width: "200px" }}>
//                                         <Button variant="contained"
//                                             sx={{ borderRadius: "10px" }}
//                                             size="large"
//                                             fullWidth
//                                             startIcon={<AddIcon />}
//                                         // onClick={toggleLoungeDialog}
//                                         >
//                                             <Typography variant="fm-p3" sx={{ fontWeight: 600, color: "#fff" }}>Add Mentor</Typography>
//                                         </Button>
//                                     </Box>
//                                 </Grid>
//                             </Grid>
//                             <TabContext value={value}>
//                                 <Box sx={{ mt: 5 }}>
//                                     <TabList
//                                         onChange={handleChange}
//                                         aria-label="lab API tabs example"
//                                         sx={{
//                                             display: "flex",
//                                             borderBottom: "none",
//                                             borderRadius: "4px",
//                                             gap: 5,
//                                             "& .MuiTabs-indicator": {
//                                                 bgcolor: "#ED1E79",
//                                             },
//                                         }}
//                                     >
//                                         {["approved", "pending", "rejected"].map(
//                                             (tab) => (
//                                                 <Tab
//                                                     key={tab}
//                                                     label={
//                                                         tab === "approved"
//                                                             ? "Approved"
//                                                             : tab === "pending"
//                                                                 ? "Pending"
//                                                                 : tab === "rejected"
//                                                                     ? "Rejected"
//                                                                     : null
//                                                     }
//                                                     value={tab}
//                                                     sx={{
//                                                         textTransform: "none",
//                                                         transition: "all 0.2s ease-in-out",
//                                                         "&.Mui-selected": {
//                                                             // bgcolor: "#9c27b026",
//                                                             color: "#ED1E79",
//                                                             fontWeight: 600,
//                                                             fontSize: "14px",
//                                                             // borderRadius: "8px",
//                                                         },
//                                                     }}
//                                                 />
//                                             )
//                                         )}
//                                     </TabList>
//                                 </Box>
//                                 <Box>
//                                     <Box mt={3}>
//                                         {value === "approved" && (
//                                             <Fade in={value === "approved"} timeout={500}>
//                                                 <TabPanel value="approved">
//                                                     <TableMentorship
//                                                         search={search}
//                                                         loading={loading}
//                                                         rows={mentorshipData}
//                                                         totalCount={totalCount}
//                                                         setCurrentPage={setCurrentPage}
//                                                         currentPage={currentPage}
//                                                         setPageSize={setPageSize}
//                                                         pageSize={pageSize}
//                                                     // toggleEdit={toggleChapterDialog}
//                                                     // toggleStatus={toggleChangeStatusDialog}
//                                                     // rolePremission={rolePremission}
//                                                     // isMasterAdmin={isMasterAdmin}
//                                                     // toggleDelete={toggleChangeStatusDialog}
//                                                     />
//                                                 </TabPanel>
//                                             </Fade>
//                                         )}

//                                         {value === "pending" && (
//                                             <Fade in={value === "pending"} timeout={500}>
//                                                 <TabPanel value="pending">
//                                                     <TableMentorship
//                                                         search={search}
//                                                         loading={loading}
//                                                         rows={mentorshipData}
//                                                         totalCount={totalCount}
//                                                         setCurrentPage={setCurrentPage}
//                                                         currentPage={currentPage}
//                                                         setPageSize={setPageSize}
//                                                         pageSize={pageSize}
//                                                     // toggleEdit={toggleChapterDialog}
//                                                     // toggleStatus={toggleChangeStatusDialog}
//                                                     // rolePremission={rolePremission}
//                                                     // isMasterAdmin={isMasterAdmin}
//                                                     // toggleDelete={toggleChangeStatusDialog}
//                                                     />
//                                                 </TabPanel>
//                                             </Fade>
//                                         )}
//                                         {value === "rejected" && (
//                                             <Fade in={value === "rejected"} timeout={500}>
//                                                 <TabPanel value="rejected">
//                                                     <TableMentorship
//                                                         search={search}
//                                                         loading={loading}
//                                                         rows={mentorshipData}
//                                                         totalCount={totalCount}
//                                                         setCurrentPage={setCurrentPage}
//                                                         currentPage={currentPage}
//                                                         setPageSize={setPageSize}
//                                                         pageSize={pageSize}
//                                                     // toggleEdit={toggleChapterDialog}
//                                                     // toggleStatus={toggleChangeStatusDialog}
//                                                     // rolePremission={rolePremission}
//                                                     // isMasterAdmin={isMasterAdmin}
//                                                     // toggleDelete={toggleChangeStatusDialog}
//                                                     />
//                                                 </TabPanel>
//                                             </Fade>
//                                         )}

//                                     </Box>
//                                 </Box>
//                             </TabContext>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>
//             {/* <DialogChapter
//                 open={chapterDialogOpen}
//                 toggle={toggleChapterDialog}
//                 mode={chapterDialogMode}
//                 dataToEdit={chapterToEdit}
//                 role={role}
//                 onSuccess={() => {
//                     fetchmentorshipData({
//                         currentPage: currentPage,
//                         pageSize: pageSize,
//                     });
//                 }}
//             />

//             <DialogStatus
//                 open={statusDialogOpen}
//                 toggle={toggleChangeStatusDialog}
//                 dataToEdit={statusToUpdate}
//                 type="chapter"
//                 onSuccess={() => {
//                     fetchmentorshipData({
//                         currentPage: currentPage,
//                         pageSize: pageSize,
//                     });
//                 }}
//             /> */}
//         </>
//     )
// }
// export default Mentorship

import React from 'react';
import ComingSoon from '../../views/common/ComingSoon';

const Mentorship = () => {
  return <ComingSoon title="Mentorship" />;
};

export default Mentorship; 