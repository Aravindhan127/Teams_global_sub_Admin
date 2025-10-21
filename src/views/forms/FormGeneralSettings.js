import { Card, CardContent, CardHeader, FormControl, FormHelperText, FormLabel, Grid, InputAdornment, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import Translations from "src/layouts/components/Translations"
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { useAuth } from "src/hooks/appSetting"

const validationSchema = yup.object().shape({
    exchange_rate: yup.number("Must be positive number only").positive("Must be positive number only").typeError("Must be positive number only").required("Required"),
})

const FormGeneralSettings = () => {
    const [loading, setLoading] = useState(false)

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            exchange_rate: 0,
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const { settings,setting } = useAuth()

    useEffect(() => {
        if (setting) {
            setValue('exchange_rate', setting.exchange_rate);
        }
    }, [setting, setValue,]);

    const onSubmit = data => {
        setLoading(true);
        settings({ exchange_rate: data.exchange_rate }, err => {
            setLoading(false);
        });
    }
   
    return <Card>
        <CardHeader
            title={<Translations text="General Settings" />}
            titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <FormLabel htmlFor='exchange_rate' error={Boolean(errors.exchange_rate)}>
                                <Translations text='Currency Equivalent to Currency' />
                            </FormLabel>
                            <Controller
                                name='exchange_rate'
                                control={control}
                                rules={{ required: true, pattern: /^[0-9]*$/ }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        disabled={loading}
                                        type="text"
                                        inputMode="numeric"
                                        value={value}
                                        autoComplete='off'
                                        onChange={onChange}
                                        error={Boolean(errors.exchange_rate)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    1 Francs CFA
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    USD
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            {errors.exchange_rate && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    <Translations text={errors.exchange_rate.message} />
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <LoadingButton size="large" type="submit" variant="contained" sx={{ minWidth: "200px" }} loading={loading}>
                            <Translations text={"Submit"} />
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
        </CardContent>
    </Card>

}

export default FormGeneralSettings