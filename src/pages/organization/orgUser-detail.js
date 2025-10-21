import { Avatar, Box, Card, CardContent, Chip, Divider, IconButton, styled, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FallbackSpinner from "src/@core/components/spinner";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import { toastError, toastSuccess } from "src/utils/utils";
import DialogRejectReason from "src/views/dialog/DialogRejectRequest";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
const OrgUserDetail = () => {
    const params = useParams();
    const { userSeqId } = params;
    const navigate = useNavigate()
    const [orgData, setOrgData] = useState('');
    const [loading, setLoading] = useState('');
    const [statusFormDialogOpen, setStatusFormDialogOpen] = useState(false);
    const [statusToEdit, setStatusToEdit] = useState(null);

    const [rejectOrgDialogOpen, setRejectOrgDialogOpen] = useState(false);
    const [rejectOrgId, setRejectOrgId] = useState(null);

    const toggleRejectOrgReq = (id) => {
        setRejectOrgDialogOpen((prev) => !prev);
        setRejectOrgId(id)
    }
    const btnStatusColors = {
        approve: '#8bc34a',  // Green for accepted
        reject: '#f44336',  // Red for rejected
    };

    const ButtonChip = styled(Chip)(({ label }) => ({
        backgroundColor: btnStatusColors[label.toLowerCase()] || '#ccc', // Default gray if label doesn't match
        borderRadius: "8px",
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px',
    }));
    const fetchData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints.ORGANIZATION_USER.getById(userSeqId))
            .then(response => {
                setOrgData(response?.data?.data?.userData);
            })
            .catch(error => {
                // Handle error
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchData();
    }, [userSeqId]);


    const toggleApproveReject = (type, id) => {

        if (type === 'approve') {
            const payload = { userSeqId: id };

            setLoading(true);
            axiosInstance
                .post(ApiEndPoints.ORGANIZATION_USER.accept, payload)
                .then((response) => {
                    toastSuccess(response.data.message);
                    fetchData();
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
    console.log("orgData", orgData)
    if (loading) return <FallbackSpinner />;

    function formatLabel(value) {
        if (!value) return "N/A";
        return value
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
    }
    return (
        <>
            <Card
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 2,
                    mb: 3
                }}
            >
                <CardContent sx={{ width: "100%" }}>

                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <ArrowBackIcon onClick={() => navigate(-1)} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                            Organization User's Details
                        </Typography>
                    </Box>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "User Name", value: `${orgData?.appUser?.firstName || ''} ${orgData?.appUser?.lastName || ''}`.trim() },
                                {
                                    label: "DOB",
                                    value: orgData?.appUser?.dateOfBirth ? moment(orgData?.appUser?.dateOfBirth).format('L') : "N/A"
                                },
                                { label: "Official Email", value: orgData?.appUser?.userEmail, isEmail: true },
                                { label: "Country", value: orgData?.appUser?.country },
                                { label: "State", value: orgData?.appUser?.state },
                                { label: "City", value: orgData?.appUser?.city },

                                // { label: "Status", value: orgData?.status },
                                {
                                    label: "Status",
                                    value: (
                                        <Box display="flex" alignItems="center" gap="10px">
                                            {/* Display Status Text */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: orgData?.status === "accepted" ? "green" :
                                                        orgData?.status === "rejected" ? "red" : "gray"
                                                }}
                                            >
                                                {orgData?.status || "N/A"}
                                            </Typography>

                                            {/* Status Action Buttons */}

                                            <Tooltip title="Approve">
                                                <IconButton
                                                    onClick={() => toggleApproveReject("approve", orgData?.userSeqId)}
                                                    disabled={orgData?.status === "accepted"}
                                                    sx={{
                                                        bgcolor: orgData?.status !== "pending" ? "#ddd" : "#00800024",
                                                        borderRadius: '10px',
                                                        opacity: orgData?.status !== "pending" ? 0.5 : 1, // Reduce opacity for disabled state
                                                        pointerEvents: orgData?.status !== "pending" ? "none" : "auto", // Disable pointer events
                                                    }}
                                                >
                                                    <CheckCircleOutlineOutlinedIcon
                                                        sx={{
                                                            fill: orgData?.status !== "pending" ? 'gray' : 'green'
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>


                                            <Tooltip title="Reject">
                                                <IconButton
                                                    onClick={() => toggleApproveReject("reject", orgData?.userSeqId)}
                                                    disabled={orgData?.status === "rejected" || orgData?.status === "accepted"}
                                                    sx={{
                                                        bgcolor: orgData?.status === "rejected" ? "#ddd" : '#ff00001f',
                                                        borderRadius: '10px',
                                                        opacity: orgData?.status !== "pending" ? 0.5 : 1,
                                                        pointerEvents: orgData?.status !== "pending" ? "none" : "auto",
                                                    }}
                                                >
                                                    <CancelOutlinedIcon
                                                        sx={{
                                                            fill: orgData?.status !== "pending" ? 'gray'
                                                                : 'red'
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            {/* <ButtonChip
                                                size="medium"
                                                disabled={orgData?.status === "accepted"}
                                                label="Approve"
                                                onClick={() => toggleApproveReject("approve", orgData?.userSeqId)}
                                            /> */}
                                            {/* <ButtonChip
                                                size="medium"
                                                disabled={orgData?.status === "rejected" || orgData?.status === "accepted"}
                                                label="Reject"
                                                onClick={() => toggleApproveReject("reject", orgData?.userSeqId)}
                                            /> */}
                                        </Box>
                                    ),
                                },

                                ...(orgData?.status === "rejected"
                                    ? [{ label: "Rejected Reason", value: orgData?.rejectReason }]
                                    : []),
                                {
                                    label: "Profile Picture",
                                    value: orgData?.appUser?.linkedinProfileUrl || orgData?.profileUrl ? (
                                        <Avatar src={orgData?.appUser?.linkedinProfileUrl || orgData?.profileUrl} />
                                    ) : "N/A"
                                },
                                { label: "Profile Bio", value: orgData?.profileBio },
                                { label: "Whatsapp Number", value: orgData?.appUser?.whatsApp },
                                { label: "Job Title", value: orgData?.job },
                                { label: "Company Name", value: orgData?.company },
                                {
                                    label: "Company Url",
                                    value: orgData?.companyUrl ? (
                                        <Link to={orgData.companyUrl} target="_blank" rel="noopener noreferrer" style={{ textTransform: "lowercase" }}>
                                            {orgData.companyUrl}
                                        </Link>
                                    ) : "N/A"
                                },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                    <TableCell
                                        sx={{
                                            width: "50%",
                                            textTransform: item.isEmail ? "lowercase" : "capitalize" // Prevent capitalization for email
                                        }}
                                    >
                                        {item.value || "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>


                    </Table>
                    {orgData?.chapterData && (
                        <Table sx={{ width: "100%", mt: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                                Chapter Detail
                            </Typography>
                            <TableBody>
                                {[
                                    { label: "Chapter Name", value: orgData?.chapterData?.chapterName },
                                    // { label: "Location", value: orgData?.chapterData?.location },
                                    // { label: "Year Established", value: orgData?.chapterData?.yearEstablished },
                                    { label: "Created At", value: moment(orgData?.chapterData?.createdAt).format('MMMM Do YYYY, h:mm a') },
                                ].map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                        <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>{item.value || "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                </CardContent>
            </Card>
            <DialogRejectReason
                open={rejectOrgDialogOpen}
                toggle={toggleRejectOrgReq}
                id={rejectOrgId}
                type={"org"}
                onSuccess={() => {
                    fetchData()
                }}
            />
        </>
    );
};
export default OrgUserDetail;
