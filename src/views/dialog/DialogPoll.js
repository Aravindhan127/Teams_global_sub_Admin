import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from "yup";
import { toastError, toastSuccess } from "src/utils/utils";
import add from "../../../src/assets/images/add.svg";
import ClearIcon from '@mui/icons-material/Clear';

const validationSchema = yup.object().shape({
    question: yup.string().trim().required("Question is required"),
    options: yup
        .array()
        .of(yup.string().trim().required("Each option is required"))
        .min(1, "At least one option is required")
        .required("Option is required"),
});

const DialogPoll = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [options, setOptions] = useState([]);
    const [currentOption, setCurrentOption] = useState("");

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            question: "",
            options: [],
        },
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Poll" : "Edit Poll");
            setOptions(dataToEdit?.options || []);
            reset({
                question: dataToEdit?.question || "",
                options: dataToEdit?.options || [],
            });
        }
    }, [dataToEdit, mode, open, reset]);

    const handleAddOption = () => {
        if (currentOption.trim()) {
            setOptions([...options, currentOption.trim()]);
            setCurrentOption("");
        }
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    const onSubmit = (data) => {
        const payload = new FormData();
        payload.append("question", data.question);
        options.forEach((opt) => payload.append("options", opt));

        setLoading(true);
        axiosInstance
            .post(ApiEndPoints.LOUNGE.poll_create, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                onSuccess();
                toastSuccess(response.data.message);
                toggle();
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Dialog open={open} fullWidth maxWidth="sm" scroll="paper">
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {dialogTitle}
                <IconButton aria-label="close" onClick={toggle} sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="question" error={Boolean(errors.question)}>
                                    Question
                                </FormLabel>
                                <Controller
                                    name="question"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} id="question" placeholder="Enter Question" error={Boolean(errors.question)} />
                                    )}
                                />
                                {errors.question && <FormHelperText sx={{ color: "error.main" }}>{errors.question.message}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="option">Option</FormLabel>
                                <TextField
                                    id="option"
                                    value={currentOption}
                                    onChange={(e) => setCurrentOption(e.target.value)}
                                    placeholder="Enter option"
                                />
                            </FormControl>
                            <IconButton sx={{ mt: 6, p: 1, borderRadius: 1 }} onClick={handleAddOption}>
                                <img src={add} alt="Add" style={{ width: "25px", height: "25px" }} />
                            </IconButton>
                        </Grid>

                        {/* Show added options */}
                        {options.length > 0 && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Added Options:
                                </Typography>
                                {options.map((option, index) => (
                                    <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                            {option}
                                        </Typography>
                                        <IconButton onClick={() => handleRemoveOption(index)}>
                                            <ClearIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <LoadingButton size="large" type="submit" form="form" variant="contained" loading={loading}>
                    {mode === "edit" ? "Update" : "Submit"}
                </LoadingButton>
                <Button size="large" variant="outlined" onClick={toggle}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogPoll;
