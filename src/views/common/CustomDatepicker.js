import React, { useState } from "react";
import { TextField } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import { format } from "date-fns"; // Import the date-fns library for date formatting
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";
import { CleaveNumberInput } from "src/@core/components/cleave-components";

const Datepicker = ({ value, onChange, onDateChange, error, minDate, size = "small",
    padding,
    width,     // Default width
    height  }) => {
    const handleDateChange = (date) => {
        // onDateChange(date);
        onChange(date);
    };

    const formatDate = (date) => {
        // Convert the date to the desired format
        return date ? format(date, "dd/MM/yyyy") : "";
    };

    const handleKeyDown = (e) => {
        // Prevent any non-numeric input
        if (!/[\d/]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
            e.preventDefault();
        }
    };

    return (
        <>
            <DatePickerWrapper>
                <DatePicker
                    selected={value}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    peekNextMonth
                    minDate={minDate && new Date().setDate(new Date().getDate() + 1)}
                    showMonthDropdown
                    showYearDropdown
                    // dropdownMode="select"
                    sx={{ width: "100%", padding: padding }}
                    placeholderText="DD/MM/YYYY"
                    customInput={
                        <TextField
                            error={error && !value}
                            fullWidth
                            size={size}
                            variant="outlined"
                            value={formatDate(value)}
                            placeholder="DD/MM/YYYY"
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                style: {
                                    padding,
                                    width,
                                    height
                                },
                                readOnly: true, // Make the input read-only to prevent direct typing
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayOutlinedIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    }
                />
            </DatePickerWrapper>
        </>
    );
};

export default Datepicker;
