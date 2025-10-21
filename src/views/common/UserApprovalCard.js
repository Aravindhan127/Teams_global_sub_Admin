import { Avatar, Box, Button, Card, CardContent, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import veltechEvent from "../../assets/images/veltechEvent.jpeg"
import right from "../../assets/images/right.svg"
import wrong from "../../assets/images/wrong.svg"
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import { useState } from "react";
import DialogRejectReason from "../dialog/DialogRejectRequest";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
const UserApprovalCard = ({ orgData, collegeStudentData, collegeAlumData, collegeFacultyData, onSuccess }) => {
    const { user } = useAuth()
    const type = user?.orgDetails?.orgType;
    const id = user?.orgDetails?.orgId
    const [loading, setLoading] = useState(false);
    const { rolePremission, isMasterAdmin } = useAuth()

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [typee, setTypee] = useState('')
    const toggleRejectReq = (id, typee) => {
        setRejectDialogOpen((prev) => !prev);
        setRejectId(id)
        setTypee(typee)
    }


    const navigate = useNavigate()
    const handleCardClick = (userType, id) => {
        console.log("userid", id)
        if (user?.orgDetails?.orgType === 'organisation') {
            navigate(`/organization-user/${id}`);
        } else if (userType === 'student') {
            navigate(`/college-user/${id}`);
        } else if (userType === 'alum') {
            navigate(`/college-user/${id}`);
        } else {
            navigate(`/college-user/${id}`);
        }
    };
    const pendingUsers = orgData.filter((item) => item.status === "pending" || item.status === "rejected");
    const pendingStudentUsers = collegeStudentData.filter(
        (item) => item.status === "pending" || item.status === "rejected"
    );
    const pendingAlumUsers = collegeAlumData.filter(
        (item) => item.status === "pending" || item.status === "rejected"
    );
    const pendingFacultyUsers = collegeFacultyData.filter(
        (item) => item.status === "pending" || item.status === "rejected"
    );


    const SectionHeader = ({ title, onSeeMore }) => (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: '10px' }}>
            <Typography variant="body1" fontWeight={600} color="textPrimary" sx={{ mt: 5 }}>
                {title}
            </Typography>
            <Button
                variant="contained"
                size="small"
                sx={{ mb: '1px', padding: "5px 10px", minHeight: "24px", fontSize: "12px", lineHeight: 1.2 }}
                onClick={onSeeMore}
            >
                See More
            </Button>
        </Box>
    );

    const UserCard = ({ item, handleCardClick }) => (
        <Box sx={{ display: "flex", flexDirection: "column", my: 5, cursor: "pointer", }} onClick={() => handleCardClick(item?.userType, item?.userSeqId)}>
            <Box sx={{ display: "flex", bgcolor: "#F0F0F0", p: 2, gap: 2, width: "100%", alignItems: "center", borderRadius: "5px" }}>
                <Avatar sx={{ bgcolor: "#ffffff" }}>{item?.appUser?.firstName?.charAt(0)}</Avatar>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <Typography variant="fm-p3" fontWeight={700}>
                            {item?.appUser?.firstName} {item?.appUser?.lastName}
                        </Typography>
                        <Typography variant="fm-p4" fontWeight={500} textTransform="capitalize">
                            {item?.userType || item?.job} - {item?.appUser?.country && item?.appUser?.country !== "null" ? item?.appUser?.country : "San Francisco"}
                        </Typography>
                        {user?.orgDetails.orgType === "organisation" ? (
                            <Typography variant="fm-p5">{item?.company}</Typography>
                        ) : (
                            <Typography variant="fm-p5">Class of {item?.passoutYear} - {item?.department?.deptName}.</Typography>
                        )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                        <Tooltip title="Approve">
                            <IconButton
                                onClick={(e) => handleAction(e, "approve", item?.userSeqId)}
                                sx={{
                                    bgcolor: item.status !== "pending" ? "#ddd" : "#00800024",
                                    borderRadius: '10px',
                                    opacity: item.status !== "pending" ? 0.5 : 1, // Reduce opacity for disabled state
                                    pointerEvents: item.status !== "pending" ? "none" : "auto", // Disable pointer events
                                    padding: { lg: "5px !important", xl: "8px !important" }
                                }}
                            >
                                <CheckCircleOutlineOutlinedIcon
                                    sx={{
                                        fill: item.status !== "pending" ? 'gray' : 'green'
                                    }}
                                />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Reject">
                            <IconButton
                                onClick={(e) => handleAction(e, "reject", item?.userSeqId)} disabled={item.status === "rejected" || item.status === "accepted"}
                                sx={{
                                    bgcolor: item.status === "rejected" ? "#ddd" : '#ff00001f',
                                    borderRadius: '10px',
                                    opacity: item.status !== "pending" ? 0.5 : 1,
                                    pointerEvents: item.status !== "pending" ? "none" : "auto",
                                    padding: { lg: "5px !important", xl: "8px !important" }
                                }}
                            >
                                <CancelOutlinedIcon
                                    sx={{
                                        fill: item.status !== "pending" ? 'gray'
                                            : 'red'
                                    }}
                                />
                            </IconButton>
                        </Tooltip>

                        {/* <IconButton onClick={(e) => handleAction(e, "approve", item?.userSeqId)}>
                            <img
                                src={right}
                                style={{
                                    height: "30px",
                                    width: "30px",
                                    opacity: item.status === "accepted" ? 0.35 : 1,
                                }}
                            />
                        </IconButton> */}

                        {/* Reject Button (Disabled if already rejected) */}
                        {/* <IconButton onClick={(e) => handleAction(e, "reject", item?.userSeqId)} disabled={item.status === "rejected" || item.status === "accepted"}>
                            <img
                                src={wrong}
                                style={{
                                    height: "30px",
                                    width: "30px",
                                    opacity: item.status === "accepted" || item.status === "rejected" ? 0.35 : 1,
                                }}
                            />
                        </IconButton> */}
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    const EmptyState = ({ message }) => (
        <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="subtitle1" fontWeight={500} color="textSecondary">
                {message}
            </Typography>
        </Box>
    );
    const CollegeSection = ({ title, data = [], seeMorePath, handleCardClick }) => {
        if (!Array.isArray(data) || data.length === 0) return null;

        const hasApproveRejectPermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.approvereject') || isMasterAdmin === true;
        const hasDetailPagePermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.details') || isMasterAdmin === true;
        return (
            <>
                <SectionHeader title={title} onSeeMore={() => navigate(seeMorePath)} />
                {Array.isArray(data) && data.length > 0 && (
                    data.slice(0, 2).map((item, index) => (
                        <>
                            <UserCard key={index} item={item} handleCardClick={handleCardClick} />
                        </>
                    ))
                )
                    //  : (
                    //     <EmptyState message="No pending approvals" />
                    // )
                }
            </>
        );
    };

    console.log("collegeStudentData", collegeStudentData)


    const handleAction = (e, type, id) => {
        e.stopPropagation();
        if (type === 'approve') {
            const payload = { userSeqId: id };

            setLoading(true);
            axiosInstance
                .post(ApiEndPoints.COLLEGE_USER.accept, payload)
                .then((response) => {
                    toastSuccess(response.data.message);
                    onSuccess();
                })
                .catch((error) => {
                    toastError(error.message || 'Something went wrong');
                })
                .finally(() => setLoading(false));
        } else if (type === 'reject') {
            // Open the dialog and set the ID for rejection
            setRejectId(id);
            setRejectDialogOpen(true);
            setTypee('college')
        }
    };

    const handleOrgApproveReject = (e, type, id) => {
        e.stopPropagation();
        if (type === 'approve') {
            const payload = { userSeqId: id };

            setLoading(true);
            axiosInstance
                .post(ApiEndPoints.ORGANIZATION_USER.accept, payload)
                .then((response) => {
                    toastSuccess(response.data.message);
                    onSuccess();
                })
                .catch((error) => {
                    toastError(error.message || 'Something went wrong');
                })
                .finally(() => setLoading(false));
        } else if (type === 'reject') {
            // Open the dialog and set the ID for rejection
            setRejectId(id);
            setRejectDialogOpen(true);
            setTypee('org')
        }
    };
    return (
        <>
            <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)', borderRadius: "20px", p: 2 }}>
                <CardContent>
                    <Typography variant="fm-h7" fontWeight={600} color="textPrimary" sx={{ mt: 1 }}>
                        User Approvals
                    </Typography>
                    {type === "organisation" && (
                        (pendingUsers?.length) > 0 ? (
                            pendingUsers.slice(0, 5).map((item, index) => (
                                <Box
                                    sx={{ display: "flex", flexDirection: "column", mt: 5, cursor: "pointer" }}
                                    key={index}
                                    onClick={() => handleCardClick(item?.userType, item?.userSeqId)}
                                >
                                    <Box sx={{ display: "flex", bgcolor: "#F0F0F0", p: 2, gap: 2, width: "100%", alignItems: "center", borderRadius: '5px' }}>
                                        <Avatar sx={{ bgcolor: "#ffffff" }}>
                                            {item?.appUser?.firstName?.charAt(0) ?? ""}
                                        </Avatar>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                <Typography variant="fm-p3" fontWeight={700}>
                                                    {item?.appUser?.firstName ?? ""} {item?.appUser?.lastName ?? ""}
                                                </Typography>

                                                <Typography variant="fm-p5" fontWeight={500} textTransform={"capitalize"}>
                                                    {item?.job ?? ""} -
                                                    {item?.appUser?.country && item?.appUser?.country !== "null"
                                                        ? item?.appUser?.country
                                                        : "San Francisco"}
                                                </Typography>
                                                {user?.orgDetails?.orgType === "organisation" ? (
                                                    <Typography variant="fm-p5">{item?.company ?? "N/A"}</Typography>
                                                ) : (
                                                    <Typography variant="fm-p5">
                                                        Class of {item?.passoutYear ?? "N/A"} - {item?.department?.deptName ?? "N/A"}.
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                                <Tooltip title="Approve">
                                                    <IconButton
                                                        onClick={(e) => handleOrgApproveReject(e, 'approve', item?.userSeqId)}
                                                        sx={{
                                                            bgcolor: item.status !== "pending" ? "#ddd" : "#00800024",
                                                            borderRadius: '10px',
                                                            opacity: item.status !== "pending" ? 0.5 : 1, // Reduce opacity for disabled state
                                                            pointerEvents: item.status !== "pending" ? "none" : "auto", // Disable pointer events
                                                            padding: { lg: "5px !important", xl: "8px !important" }
                                                        }}
                                                    >
                                                        <CheckCircleOutlineOutlinedIcon
                                                            sx={{
                                                                fill: item.status !== "pending" ? 'gray' : 'green'
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>


                                                <Tooltip title="Reject">
                                                    <IconButton
                                                        onClick={(e) => handleOrgApproveReject(e, "reject", item?.userSeqId)} disabled={item.status === "rejected" || item.status === "accepted"}
                                                        sx={{
                                                            bgcolor: item.status === "rejected" ? "#ddd" : '#ff00001f',
                                                            borderRadius: '10px',
                                                            opacity: item.status !== "pending" ? 0.5 : 1,
                                                            pointerEvents: item.status !== "pending" ? "none" : "auto",
                                                            padding: { lg: "5px !important", xl: "8px !important" }
                                                        }}
                                                    >
                                                        <CancelOutlinedIcon
                                                            sx={{
                                                                fill: item.status !== "pending" ? 'gray'
                                                                    : 'red'
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* <IconButton onClick={(e) => handleOrgApproveReject(e, 'approve', item?.userSeqId)}>
                                                    <img
                                                        src={right}
                                                        style={{
                                                            height: "30px",
                                                            width: "30px",
                                                            opacity: item?.status === "accepted" ? 0.35 : 1,
                                                        }}
                                                    />
                                                </IconButton> */}
                                                {/* <IconButton onClick={(e) => handleOrgApproveReject(e, "reject", item?.userSeqId)} disabled={item.status === "rejected" || item.status === "accepted"}>
                                                    <img
                                                        src={wrong}
                                                        style={{
                                                            height: "30px",
                                                            width: "30px",
                                                            opacity: item.status === "accepted" || item.status === "rejected" ? 0.35 : 1,
                                                        }}
                                                    />
                                                </IconButton> */}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Box sx={{ height: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                <PriorityHighRoundedIcon sx={{ fontSize: 50, color: "gray" }} />
                                <Typography variant="h6" fontWeight={500} color="textSecondary">
                                    No Pending Approvals
                                </Typography>
                            </Box>
                        )
                    )}

                    {type === "college" && (
                        pendingStudentUsers.length > 0 || pendingAlumUsers.length > 0 || pendingFacultyUsers.length > 0 ? (
                            <>
                                <CollegeSection title="Student" data={pendingStudentUsers} seeMorePath="/student-list" handleCardClick={handleCardClick} />
                                <CollegeSection title="Alumni" data={pendingAlumUsers} seeMorePath="/alumni" handleCardClick={handleCardClick} />
                                <CollegeSection title="Faculty" data={pendingFacultyUsers} seeMorePath="/faculty" handleCardClick={handleCardClick} />
                            </>
                        ) : (
                            <Box sx={{ height: 250, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                {/* <PriorityHighRoundedIcon sx={{ fontSize: 50, color: "gray" }} /> */}
                                <Typography variant="h6" fontWeight={500} color="textSecondary">
                                    No Pending Approvals
                                </Typography>
                            </Box>
                        )
                    )}

                </CardContent>
            </Card>

            <DialogRejectReason
                open={rejectDialogOpen}
                toggle={toggleRejectReq}
                id={rejectId}
                type={typee}
                onSuccess={() => {
                    onSuccess();
                }}
            />
        </>



    );
};

export default UserApprovalCard;
