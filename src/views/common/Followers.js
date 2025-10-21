import React from "react";
import { Grid, Avatar, Typography, Box, Card, CardContent } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";

const Followers = ({ followersData }) => {
    console.log("followersData", followersData);
    const navigate = useNavigate();
    const { user } = useAuth()
    console.log("user", user);
    const handleLoungesClick = (userSeqId, item) => {
        if (item?.orgUser) {
            navigate(`/organization-user/${userSeqId}`)
        } else {
            navigate(`/college-user/${userSeqId}`)
        }
    }
    return (
        <Card sx={{ borderRadius: "5px", mt: 2 }}>
            <CardContent>
                <Grid container spacing={2}>
                    {followersData && followersData.length > 0 ? (
                        followersData
                            .map((item) => (
                                <Grid
                                    item
                                    xs={12}
                                    key={item.loungeId}
                                    onClick={item?.adminData ? undefined : () => handleLoungesClick(item?.collegeUser?.userSeqId || item?.orgUser?.userSeqId, item)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        bgcolor: "#F0F0F0",
                                        mt: 1,
                                        p: 1,
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Avatar
                                        alt={`${item.collegeUser?.appUser?.firstName || item.orgUser?.appUser?.firstName}`}
                                        src={item.collegeUser?.profileUrl || item.orgUser?.profileUrl || item?.isAddedByAdmin === true && user.orgDetails.logo}
                                        sx={{ width: 50, height: 50, bgcolor: "white" }}
                                    />

                                    <Box>
                                        <Typography variant="body1" fontWeight={500}>
                                            {item?.isAddedByAdmin === true && `${item.adminData.firstName} ${item.adminData.lastName}`}
                                            {item.collegeUser?.appUser?.firstName && item.collegeUser?.appUser?.lastName
                                                && `${item.collegeUser.appUser.firstName} ${item.collegeUser.appUser.lastName}`
                                            }
                                            {item.orgUser && `${item.orgUser?.appUser?.firstName} ${item.orgUser?.appUser?.lastName}`}
                                        </Typography>
                                        <Typography variant="body2" color="gray">
                                            {item?.isAddedByAdmin === true ? "You Followed this" : "Followed"} {moment(item.createdAt).fromNow()}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))
                    ) : (
                        <Grid item xs={12} key="no-followers">
                            No Followers
                        </Grid>
                    )}


                </Grid>

            </CardContent>
        </Card>
    );
};

export default Followers;
