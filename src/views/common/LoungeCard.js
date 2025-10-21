import { Avatar, AvatarGroup, Box, Button, Card, CardContent, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import right from "../../assets/images/right.svg"
import wrong from "../../assets/images/wrong.svg"
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import avatar1 from "../../assets/images/avatar1.png"
import avatar2 from "../../assets/images/avatar2.png"
import avatar3 from "../../assets/images/avatar3.png"
import moment from "moment";
import DialogApproveReject from "../dialog/DialogApproveReject";
import { useState } from "react";
import { ApiEndPoints } from "src/network/endpoints";
import { axiosInstance } from "src/network/adapter";
import { toastError, toastSuccess } from "src/utils/utils";
import DialogRejectReason from "../dialog/DialogRejectRequest";
import { useAuth } from "src/hooks/useAuth";

const LoungeCard = ({ loungeData, onSuccess }) => {
    const navigate = useNavigate();
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
    const handleCardClick = (id) => {
        if (hasDetailPagePermission) {
            navigate(`/lounge/${id}`)
        }
    };

    const handleAction = (e, type, item) => {
        e.stopPropagation();
        if (type === 'approved') {
            const payload = { loungeId: item.loungeId, status: 'approved' };

            setLoading(true);
            axiosInstance
                .post(ApiEndPoints.LOUNGE.approve_reject, payload)
                .then((response) => {
                    toastSuccess(response.data.message);
                    onSuccess();
                })
                .catch((error) => {
                    toastError(error.message || 'Something went wrong');
                })
                .finally(() => setLoading(false));
        } else if (type === 'rejected') {
            // Open the dialog and set the ID for rejection
            setRejectId(item.loungeId);
            setRejectDialogOpen(true);
            setTypee('lounge')
        }
    };
    const pendingLoungeData = loungeData?.filter((item) => item.status === "pending");
    const hasApproveRejectPermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.approvereject') || isMasterAdmin === true;
    const hasDetailPagePermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.details') || isMasterAdmin === true;


    console.log("loungeData", loungeData)
    console.log("pendingLoungeData", pendingLoungeData)
    return (
        <>
            <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)', borderRadius: "20px", p: 2 }}>
                <CardContent>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: '10px' }}>
                        <Typography variant="fm-h7" fontWeight={600} color="textPrimary" sx={{ mt: 1 }}>
                            Lounge
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ mb: '1px', padding: "5px 10px", minHeight: "24px", fontSize: "12px", lineHeight: 1.2 }}
                            onClick={() => {
                                if (hasDetailPagePermission) {
                                    navigate('/lounge');
                                }
                            }}
                        >
                            See More
                        </Button>

                    </Box>

                    {
                        (pendingLoungeData?.length) > 0 ? (
                            pendingLoungeData.slice(0, 5).map((item, index) => (
                                <Grid container
                                    sx={{ mt: 5, cursor: hasDetailPagePermission ? "pointer" : "not-allowed" }}
                                    key={index}
                                    onClick={() => handleCardClick(item.loungeId)}
                                >
                                    <Grid item container xs={12} sx={{ bgcolor: "#F0F0F0", borderRadius: '5px', padding: 2 }}>

                                        <Grid item xs={8} sx={{ display: "flex", gap: 1, alignItems: "start", flex: 1, padding: 2 }}>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                <Typography variant="fm-p5" fontWeight={500} color={'#000'} sx={{ textWrap: "wrap", wordBreak: "break-word" }}>
                                                    {item?.title || item?.pollQuestion}
                                                </Typography>
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <AvatarGroup max={2}>
                                                        <Avatar alt={item.collegeUser?.appUser?.firstName} src={item.collegeUser?.profileUrl} sx={{ width: "20px", height: "20px" }} />
                                                    </AvatarGroup>
                                                    <Typography variant="fm-p6">{moment(new Date(item.createdAt)).fromNow()}</Typography>
                                                </Box>

                                            </Box>
                                        </Grid>

                                        <Grid item xs={2} sx={{ display: "flex", gap: 1, alignItems: "center", flex: 1 }}>
                                            <Box>
                                                <img
                                                    src={item?.media[0]?.mediaPath}
                                                    style={{
                                                        height: "50px",
                                                        width: "50px",
                                                        borderRadius: "25%",
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        {hasApproveRejectPermission ?
                                            <Grid item xs={2} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                                <Tooltip title="Approve">
                                                    <IconButton
                                                        onClick={(e) => item.status === "pending" && handleAction(e, "approved", item)}
                                                        disabled={item.status !== "pending"}
                                                        sx={{
                                                            bgcolor: item.status !== "pending" ? "#ddd" : "#00800024",
                                                            borderRadius: '10px',
                                                            opacity: item.status !== "pending" ? 0.5 : 1, // Reduce opacity for disabled state
                                                            pointerEvents: item.status !== "pending" ? "none" : "auto", // Disable pointer events
                                                            padding: { md: "3px !important", xl: "8px !important" }
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
                                                        onClick={(e) => item.status === "pending" && handleAction(e, "rejected", item)}
                                                        disabled={item.status !== "pending"}
                                                        sx={{
                                                            bgcolor: item.status === "rejected" ? "#ddd" : '#ff00001f',
                                                            borderRadius: '10px',
                                                            opacity: item.status !== "pending" ? 0.5 : 1,
                                                            pointerEvents: item.status !== "pending" ? "none" : "auto",
                                                            padding: { md: "3px !important", xl: "8px !important" }
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
                                                {/* <img
       src={right}
       onClick={(e) => item.status === "pending" && handleAction(e, "approved", item)}
       style={{
           height: "30px",
           width: "30px",
           opacity: item.status !== "pending" && item.status === "approved" ? 0.5 : 1,
           cursor: item.status !== "pending" && item.status === "approved" ? "not-allowed" : "pointer",
       }}
   /> */}

                                                {/* <img
       src={wrong}
       onClick={(e) => item.status === "pending" && handleAction(e, "rejected", item)}
       style={{
           height: "30px",
           width: "30px",
           opacity: item.status !== "pending" && item.status === "rejected" ? 0.5 : 1,
           cursor: item.status !== "pending" && item.status === "rejected" ? "not-allowed" : "pointer",
       }}
   /> */}
                                            </Grid>
                                            : null
                                        }



                                    </Grid>
                                </Grid>
                            ))
                        ) : (
                            <Box sx={{ height: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                <PriorityHighRoundedIcon sx={{ fontSize: 50, color: "gray" }} />
                                <Typography variant="h6" fontWeight={500} color="textSecondary">
                                    No Pending Approvals
                                </Typography>
                            </Box>
                        )
                    }
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

export default LoungeCard;
