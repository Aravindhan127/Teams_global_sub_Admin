import { Avatar, Box, Card, CardContent, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FallbackSpinner from "src/@core/components/spinner";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import axios from "axios";
import authConfig from '../../configs/auth'
import { useAuth } from "src/hooks/useAuth";
const Profile = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { rolePremission, isMasterAdmin, setIsCompletedProfile } = useAuth()
    const { collegeId } = params;
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState('');
    const [statusFormDialogOpen, setStatusFormDialogOpen] = useState(false);
    const [statusToEdit, setStatusToEdit] = useState(null);
    const type = window.localStorage.getItem("loginType");
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = {
                Authorization: `Bearer ${storedToken}`,
            };
            let response;
            if (type === "organisation") {
                response = await axios.get(ApiEndPoints.AUTH.organization_me, { headers });
            } else {
                response = await axios.get(ApiEndPoints.AUTH.college_me, { headers });
            }
            setUser({ ...response.data.data });
            const authuser = response.data.data;
            setIsCompletedProfile(authuser?.user?.orgDetails?.isApproved)
        } catch (error) {
            // Handle error
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = () => {
        console.log("type", user?.user?.orgDetails?.orgType)
        const path = user?.user?.orgDetails?.orgType === 'college' ? '/edit-clg-profile' : '/edit-org-profile';
        navigate(path, { state: user });
    };

    console.log("user", user)
    if (loading) return <FallbackSpinner />;

    function formatLabel(value) {
        if (!value) return "N/A";
        return value
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
    }

    const hasPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'profile.edit') || isMasterAdmin === true;
    return (
        <>
            {/* <Typography
                sx={{
                    color: "#1F252E",
                    fontSize: "20px",
                    lineHeight: "25px",
                    fontWeight: 700,
                    mb: 2
                }}
            >
                My Profile
            </Typography> */}
            <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                <CardContent sx={{ width: "100%" }}>
                    {hasPermission &&
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }} onClick={handleEditClick}>
                            <EditIcon />
                        </Box>
                    }

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        {user?.user?.orgDetails?.orgType === 'college' ? 'Basic College Details' : 'Basic Organization Details'}
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Organization Name:", value: user?.user?.orgDetails?.orgName },
                                { label: "Website URL:", value: user?.user?.orgDetails?.websiteUrl },
                                { label: "Official Email:", value: user?.user?.orgDetails?.orgEmail },
                                {
                                    label: "Contact Number:",
                                    value: user?.user?.orgDetails?.contactNumber
                                        ? `+${user?.user?.orgDetails?.contactNumber}`
                                        : 'N/A'
                                },

                                { label: "Street Address:", value: user?.user?.orgDetails?.streetAddress },
                                { label: "Country:", value: user?.user?.orgDetails?.country },
                                { label: "State:", value: user?.user?.orgDetails?.state },
                                { label: "City:", value: user?.user?.orgDetails?.city },
                                { label: "Postal Code:", value: user?.user?.orgDetails?.postalCode },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, width: "50%" }}>Logo:</TableCell>
                                <TableCell sx={{ width: "50%" }}>
                                    <Avatar
                                        src={user?.user?.orgDetails?.logo}
                                        sx={{ width: 100, height: 100, borderRadius: 2 }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Administrator / Point of Contact
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                {
                                    label: "Primary Contact Name", value: user?.user?.orgDetails?.adminFirstName && user?.user?.orgDetails?.adminLastName
                                        ? `${user.user.orgDetails.adminFirstName} ${user.user.orgDetails.adminLastName}`
                                        : null,
                                },
                                {
                                    label: "Phone Number",
                                    value: user?.user?.orgDetails?.adminPhone
                                        ? `+${user?.user?.orgDetails?.adminPhone}`
                                        : 'N/A'
                                },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {user?.user?.orgDetails?.orgType === 'college' ?
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                                Program and Alumni Information
                            </Typography>
                            <Table sx={{ width: "100%", mt: 1 }}>
                                <TableBody>
                                    {[
                                        {
                                            label: "Number of Programs Offered",
                                            value: (
                                                <Typography variant="fm-p3" sx={{ fontWeight: 400, textTransform: "capitalize" }}>
                                                    {user?.user?.orgDetails?.collegePrograms?.length || 0}
                                                </Typography>
                                            ),
                                        },

                                    ].map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                            <TableCell sx={{ width: "50%" }}>{item.value || "N/A"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                        : null}

                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Total User Count", value: user?.user?.orgDetails?.totalAlumniCount },
                                // { label: "Total Alumni Count", value: user?.user?.orgDetails?.totalAlumCount },
                                // { label: "Total Student Count", value: user?.user?.orgDetails?.totalStudCount },
                                // { label: "Total Faculty Count", value: user?.user?.orgDetails?.totalFacultyCount },
                                { label: "Year Established", value: user?.user?.orgDetails?.yearEstablished },
                                // { label: "Current enrolled Students", value: user?.user?.orgDetails?.currentEnrollment },
                                { label: "Active Alumni Associations", value: user?.user?.orgDetails?.isActiveAlumniAssociations === true ? "true" : "false" },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value !== null && item.value !== undefined ? item.value : "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Engagement Features Setup
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Preferred Features", value: user?.user?.orgDetails?.preferredFeatures }
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{formatLabel(item.value || "N/A")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Integration Needs
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: " Integration Needs", value: user?.user?.orgDetails?.integrationNeeds }
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{formatLabel(item.value || "N/A")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Customization Options
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, width: "50%" }}>Custom Branding:</TableCell>
                                <TableCell sx={{ width: "50%" }}>
                                    <Avatar
                                        src={user?.user?.orgDetails?.brandingFile}
                                        sx={{ width: 100, height: 100, borderRadius: 2 }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Social Media Links
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Linkedin Url", value: user?.user?.orgDetails?.linkedInUrl },
                                { label: "Instagram Url", value: user?.user?.orgDetails?.instagramUrl },
                                { label: "Twitter Url", value: user?.user?.orgDetails?.twitterUrl },
                                { label: "Facebook Url", value: user?.user?.orgDetails?.facebookUrl },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>
                                        {item.value ? (
                                            <Link to={item.value} target="_blank" rel="noopener noreferrer">
                                                {item.value}
                                            </Link>
                                        ) : (
                                            "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Additional Comments/Requirements
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Additional Comments/Requirements", value: user?.user?.orgDetails?.additionalComments },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value === null || item.value === 'null' ? "N/A" : item?.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, color: "primary.main" }}>
                        Status
                    </Typography>
                    <Table sx={{ width: "100%", mt: 1 }}>
                        <TableBody>
                            {[
                                { label: "Submitted By", value: user?.user?.orgDetails?.submittedBy },
                                // { label: "Email", value: user?.confirmationEmail },
                                // { label: "Phone Number", value: user?.confirmationPhone },
                                {
                                    label: "Status",
                                    value: user?.user?.orgDetails?.isRejected
                                        ? "Rejected"
                                        : user?.user?.orgDetails?.isApproved
                                            ? "Accepted"
                                            : "Pending",
                                },
                                ...(user?.user?.orgDetails?.isRejected
                                    ? [
                                        {
                                            label: "Rejected Reason",
                                            value: user?.user?.orgDetails?.rejectNotes
                                        }]
                                    : []),

                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}:</TableCell>
                                    <TableCell sx={{ width: "50%" }}>{item.value || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                </CardContent>
            </Card>

        </>
    );
};
export default Profile;
