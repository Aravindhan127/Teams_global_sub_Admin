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
const CollegeUserDetail = () => {
    const params = useParams();
    const { userSeqId } = params;
    const navigate = useNavigate()
    const [collegeData, setCollegeData] = useState('');
    const [loading, setLoading] = useState('');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);

    const toggleRejectReq = (id) => {
        setRejectDialogOpen((prev) => !prev);
        setRejectId(id)
    }

    const fetchData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints.COLLEGE_USER.getById(userSeqId))
            .then(response => {
                setCollegeData(response?.data?.data?.userData);
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
                .post(ApiEndPoints.COLLEGE_USER.accept, payload)
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
            setRejectId(id);
            setRejectDialogOpen(true);
        }
    };


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

    console.log("collegedata", collegeData)
    if (loading) return <FallbackSpinner />;

    function formatLabel(value) {
        if (!value) return "N/A";
        return value
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
    }

    const handleNavigation = () => {
        navigate(-1);
        // if (collegeData?.userType === "student") {
        //     navigate('/student-list');
        // } else if (collegeData?.userType === "faculty") {
        //     navigate('/faculty');
        // } else {
        //     navigate('/alumni');
        // }
    }
    return (
        <>
            <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                <CardContent sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <ArrowBackIcon onClick={() => handleNavigation()} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                            College User's Details
                        </Typography>
                    </Box>


                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "User Name", value: `${collegeData?.appUser?.firstName || ''} ${collegeData?.appUser?.lastName || ''}`.trim() },
                                { label: "Official Email", value: collegeData?.appUser?.userEmail, isEmail: true },
                                { label: "DOB", value: moment(collegeData?.appUser?.dateOfBirth).format('L') },
                                // { label: "Country:", value: collegeData?.appUser?.country },
                                // { label: "State:", value: collegeData?.appUser?.state },
                                // { label: "City:", value: collegeData?.appUser?.city },
                                {
                                    label: "Status",
                                    value: (
                                        <Box display="flex" alignItems="center" gap="10px">
                                            {/* Display Status Text */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: collegeData?.status === "accepted" ? "green" :
                                                        collegeData?.status === "rejected" ? "red" : "gray"
                                                }}
                                            >
                                                {collegeData?.status || "N/A"}
                                            </Typography>

                                            {/* Status Action Buttons */}
                                            <Tooltip title="Approve">
                                                <IconButton
                                                    onClick={() => toggleApproveReject("approve", collegeData?.userSeqId)}
                                                    disabled={collegeData?.status === "accepted"}
                                                    sx={{
                                                        bgcolor: collegeData?.status !== "pending" ? "#ddd" : "#00800024",
                                                        borderRadius: '10px',
                                                        opacity: collegeData?.status !== "pending" ? 0.5 : 1, // Reduce opacity for disabled state
                                                        pointerEvents: collegeData?.status !== "pending" ? "none" : "auto", // Disable pointer events
                                                    }}
                                                >
                                                    <CheckCircleOutlineOutlinedIcon
                                                        sx={{
                                                            fill: collegeData?.status !== "pending" ? 'gray' : 'green'
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>



                                            <Tooltip title="Reject">
                                                <IconButton
                                                    onClick={() => toggleApproveReject("reject", collegeData?.userSeqId)}
                                                    disabled={collegeData?.status === "rejected" || collegeData?.status === "accepted"}
                                                    sx={{
                                                        bgcolor: collegeData?.status === "rejected" ? "#ddd" : '#ff00001f',
                                                        borderRadius: '10px',
                                                        opacity: collegeData?.status !== "pending" ? 0.5 : 1,
                                                        pointerEvents: collegeData?.status !== "pending" ? "none" : "auto",
                                                    }}
                                                >
                                                    <CancelOutlinedIcon
                                                        sx={{
                                                            fill: collegeData?.status !== "pending" ? 'gray'
                                                                : 'red'
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>


                                            {/* <ButtonChip
                                                size="medium"
                                                disabled={collegeData?.status === "accepted"}
                                                label="Approve"
                                                onClick={() => toggleApproveReject("approve", collegeData?.userSeqId)}
                                            /> */}
                                            {/* <ButtonChip
                                                size="medium"
                                                disabled={collegeData?.status === "rejected" || collegeData?.status === "accepted"}
                                                label="Reject"
                                                onClick={() => toggleApproveReject("reject", collegeData?.userSeqId)}
                                            /> */}
                                        </Box>
                                    ),
                                },


                                // ...(collegeData?.userType === "student"
                                //     ? [{ label: "Passout Year:", value: collegeData?.passoutYear }]
                                //     : []),

                                ...(collegeData?.status === "rejected"
                                    ? [{ label: "Rejected Reason", value: collegeData?.rejectReason }]
                                    : []),
                                { label: "User Type", value: collegeData?.userType },
                                ...((collegeData?.userType !== "faculty" && collegeData?.currentStatus !== "entrepreneur")
                                    ? [{ label: "Student Id", value: collegeData?.studentId }]
                                    : []),

                                ...(collegeData?.passoutYear ? [{ label: "Passout Year", value: collegeData?.passoutYear }] : []),
                                { label: "Department", value: collegeData?.department?.deptName },
                                { label: "Degree", value: collegeData?.degree?.degreeName },
                                ...(collegeData?.userType === "faculty"
                                    ? [{ label: "Employee Id", value: collegeData?.employeeId }]
                                    : []),
                                { label: "Chapter Name", value: collegeData?.chapterData?.chapterName },
                                ...(collegeData?.userType === "alum"
                                    ? [{
                                        label: "Current Status",
                                        value: collegeData?.currentStatus
                                            ?.replace(/([A-Z])/g, " $1") // Add space before uppercase letters
                                            .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
                                    },]
                                    : []),

                                // {
                                //     label: "Profile:",
                                //     value: collegeData?.appUser?.linkedinProfileUrl || collegeData?.profileUrl ? (
                                //         <Avatar src={collegeData?.appUser?.linkedinProfileUrl || collegeData?.profileUrl} />
                                //     ) : "N/A"
                                // },
                                // { label: "Whatsapp Number:", value: collegeData?.appUser?.whatsApp },
                                // { label: "Profile Bio:", value: collegeData?.profileBio },
                                // {
                                //     label: "LinkedIn Url",
                                //     value: collegeData?.linkedinUrl ? (
                                //         <Link to={collegeData.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ textTransform: "lowercase" }}>
                                //             {collegeData.linkedinUrl}
                                //         </Link>
                                //     ) : "N/A"
                                // }

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
                    {/* 
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Department & Degree
                    </Typography> */}
                    {/* <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Department", value: collegeData?.department?.deptName },
                                { label: "Degree", value: collegeData?.degree?.degreeName },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>{item.value || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> */}
                    {(collegeData?.userType !== 'student' && collegeData?.userType !== 'faculty' &&
                        (collegeData?.userType === 'alum' && collegeData?.currentStatus === 'higherStudy') ||
                        (collegeData?.userType === 'alum' && (collegeData?.currentStatus === 'employee' || collegeData?.currentStatus === 'entrepreneur') && collegeData?.educations?.length > 0)
                    ) && (
                            <>
                                <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                                    Higher Education Information
                                </Typography>

                                {collegeData?.educations?.length > 0 ? (
                                    <Table sx={{ width: "100%", mt: 1 }}>
                                        <TableBody>
                                            {collegeData.educations.map((education, eduIndex) => (
                                                <>
                                                    {[
                                                        { label: "Institution Name", value: education.institutionName },
                                                        // { label: "Department", value: education.department },
                                                        { label: "Degree", value: education.degree },
                                                        { label: "Passout Year", value: education.passoutYear },
                                                        { label: "Country", value: education.country },
                                                        { label: "State", value: education.state },
                                                        { label: "City", value: education.city },
                                                    ].map((item, index) => (
                                                        <TableRow key={`${eduIndex}-${index}`}>
                                                            <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                                            <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>{item.value || "N/A"}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {eduIndex !== collegeData.educations.length - 1 && (
                                                        <TableRow>
                                                            <TableCell colSpan={2}>
                                                                <Divider sx={{ my: 1 }} />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Table sx={{ width: "100%", mt: 1 }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, width: "50%" }}> Education Information</TableCell>
                                                <TableCell sx={{ width: "50%" }}>N/A</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                )}
                            </>
                        )}

                    {(collegeData?.userType !== 'faculty' &&
                        (collegeData?.userType !== 'student' ||
                            (collegeData?.userType === 'alum' && (collegeData?.currentStatus === 'employee' || collegeData?.currentStatus === 'entrepreneur') && collegeData?.employments?.length > 0))
                    ) && (
                            <>
                                {collegeData?.employments?.length > 0 && (
                                    <>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                                            Employment Details
                                        </Typography>


                                        <Table sx={{ width: "100%", mt: 1 }}>
                                            <TableBody>
                                                {collegeData.employments.map((employment, empIndex) => (
                                                    <>
                                                        {[
                                                            { label: "Company Name", value: employment.companyName },
                                                            { label: "Job Title", value: employment.jobTitle },
                                                            { label: "Company Url", value: employment.companyUrl, isUrl: true },
                                                            { label: "Country", value: employment.country },
                                                            { label: "State", value: employment.state },
                                                            { label: "City", value: employment.city },
                                                        ].map((item, index) => (
                                                            <TableRow key={`${empIndex}-${index}`}>
                                                                <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                                                <TableCell sx={{
                                                                    width: "50%",
                                                                    textTransform: item.isUrl ? "none" : "capitalize", // Avoid capitalization for URLs
                                                                }}> {item.isUrl && item.value ? (
                                                                    <a href={item.value} target="_blank" rel="noopener noreferrer">
                                                                        {item.value}
                                                                    </a>
                                                                ) : (
                                                                    item.value || "N/A"
                                                                )}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        {empIndex !== collegeData.employments.length - 1 && (
                                                            <TableRow>
                                                                <TableCell colSpan={2}>
                                                                    <Divider sx={{ my: 1 }} />
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </>
                                                ))}
                                            </TableBody>
                                        </Table>

                                    </>
                                )}
                            </>
                        )}


                    {/* {(collegeData?.userType !== 'student' && collegeData?.userType !== 'faculty' &&
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                                Chapter Detail
                            </Typography>
                            <Table sx={{ width: "100%", mt: 1 }}>
                                <TableBody>
                                    {[

                                        // { label: "Location", value: collegeData?.chapterData?.location },
                                        // { label: "Year Established", value: collegeData?.chapterData?.yearEstablished },

                                    ].map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                            <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>
                                                {item.value || "N/A"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    )} */}

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Contact & Profile Information
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                {
                                    label: "Profile Picture",
                                    value: collegeData?.appUser?.linkedinProfileUrl || collegeData?.profileUrl ? (
                                        <Avatar src={collegeData?.appUser?.linkedinProfileUrl || collegeData?.profileUrl} />
                                    ) : "N/A"
                                },
                                { label: "Whatsapp Number", value: collegeData?.appUser?.whatsApp },
                                { label: "Profile Bio", value: collegeData?.profileBio },
                                {
                                    label: "LinkedIn Url",
                                    value: collegeData?.linkedinUrl ? (
                                        <Link to={collegeData.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ textTransform: "lowercase" }}>
                                            {collegeData.linkedinUrl}
                                        </Link>
                                    ) : "N/A"
                                },
                                { label: "Created At", value: moment(collegeData?.chapterData?.createdAt).format('MMMM Do YYYY, h:mm a') },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                    <TableCell sx={{ width: "50%", textTransform: "capitalize" }}>{item.value || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <DialogRejectReason
                open={rejectDialogOpen}
                toggle={toggleRejectReq}
                id={rejectId}
                type={"college"}
                onSuccess={() => {
                    fetchData()
                }}
            />
        </>
    );
};
export default CollegeUserDetail;
