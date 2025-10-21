import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Typography,
    Box,
    IconButton,
    FormControl,
    FormLabel,
    FormHelperText,
    Grid,
    TextField,
    MenuItem,
    Select,
    InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import "react-quill/dist/quill.snow.css";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigate } from "react-router-dom";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import toast from "react-hot-toast";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import authConfig from "../../configs/auth";

const schema = yup.object({
    oldPassword: yup.string().required("Enter Current Password"),
    newPassword: yup
        .string()
        .required("Enter New Password")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirm_password: yup
        .string("Enter Valid Confirm Password Format")
        .required("Enter Confirm Password")
        .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});
const DialogChangePassword = (props) => {
    const { open, toggle, onSuccess } = props;
    const navigate = useNavigate();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    const handleToggleOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    };
    const handleToggleNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };
    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
        },
        resolver: yupResolver(schema),
    });
    const handleChangePassword = async (data) => {
        try {
            const response = await axiosInstance.post(
                ApiEndPoints.AUTH.changePassword,
                {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success(response.data.message);
            toggle();
            reset();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
    useEffect(() => {
        if (!open) {
            reset(); // Reset the form when the dialog closes
        }
    }, [open, reset]);
    return (
        <>
            <Dialog
                open={open}
                onClose={toggle}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-paper": {
                        width: "408px",
                        maxWidth: "none", // Prevents default maxWidth styles from overriding your custom width
                        borderRadius: "20px",
                        p: 1,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "20px",
                                fontWeight: 600,
                                color: "#101828",
                                lineHeight: "30px",
                            }}
                            gutterBottom
                        >
                            Change Password
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#667085",
                                lineHeight: "20px",
                            }}
                        >
                            Create a new Password
                        </Typography>
                    </Box>

                    <IconButton aria-label="close" onClick={toggle}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form
                        id="change-password-form"
                        onSubmit={handleSubmit(handleChangePassword)}
                    >
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mt: 4 }}>
                                    <FormLabel htmlFor="oldPassword"> Current Password</FormLabel>
                                    <Controller
                                        name="oldPassword"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                id="oldPassword"
                                                placeholder="Enter Confirm Password"
                                                value={value}
                                                onChange={onChange}
                                                type={showOldPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                error={Boolean(errors.password)}
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleToggleOldPassword}
                                                                edge="end"
                                                            >
                                                                {showOldPassword ? (
                                                                    <VisibilityOutlinedIcon />
                                                                ) : (
                                                                    <VisibilityOffOutlinedIcon />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.oldPassword && (
                                        <FormHelperText sx={{ color: "error.main" }}>
                                            {errors.oldPassword.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mt: 4 }}>
                                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                                    <Controller
                                        name="newPassword"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                id="newPassword"
                                                placeholder="Enter New Password"
                                                value={value}
                                                onChange={onChange}
                                                type={showOldPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                error={Boolean(errors.newPassword)}
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleToggleOldPassword}
                                                                edge="end"
                                                            >
                                                                {showOldPassword ? (
                                                                    <VisibilityOutlinedIcon />
                                                                ) : (
                                                                    <VisibilityOffOutlinedIcon />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.newPassword && (
                                        <FormHelperText sx={{ color: "error.main" }}>
                                            {errors.newPassword.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mt: 4 }}>
                                    <FormLabel htmlFor="confirm_password">
                                        Confirm Password
                                    </FormLabel>
                                    <Controller
                                        name="confirm_password"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                id="confirm_password"
                                                placeholder="Enter Confirm Password"
                                                value={value}
                                                onChange={onChange}
                                                type={showOldPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                error={Boolean(errors.newPassword)}
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleToggleOldPassword}
                                                                edge="end"
                                                            >
                                                                {showOldPassword ? (
                                                                    <VisibilityOutlinedIcon />
                                                                ) : (
                                                                    <VisibilityOffOutlinedIcon />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.confirm_password && (
                                        <FormHelperText sx={{ color: "error.main" }}>
                                            {errors.confirm_password.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                    }}
                >
                    <Button
                        size="large"
                        variant="outlined"
                        onClick={toggle}
                        sx={{
                            borderRadius: "8px",
                            border: "1px solid #D0D5DD",
                            color: "#344054",
                        }}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        size="large"
                        type="submit"
                        form="change-password-form"
                        variant="contained"
                        // loading={loading}
                        sx={{ borderRadius: "8px" }}
                    >
                        Save
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default DialogChangePassword 