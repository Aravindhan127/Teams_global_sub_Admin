export const FormValidationMessages = {
    EMAIL: {
        required: 'Email is required',
        invalid: 'Must be a valid email address',
    },
    PASSWORD: {
        required: 'Password is required',
        minLength: 8,
        minLengthErrorMessage: 'Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase',
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        patternErrorMessage: 'Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase'
    },
    FIRST_NAME: {
        required: 'First name is required',
    },
    LAST_NAME: {
        required: 'Last name is required',
    },
    BUSINESS_NAME: {
        required: 'Name of Business is required',
    },
    CITY_NAME: {
        required: 'City Name is required',
    },
    COUNTRY: {
        required: 'Country is required',
    },
    IS_USER_CONSENT: {
        required: 'User Consent is required',
    }
}