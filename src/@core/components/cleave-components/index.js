// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

export function CleaveNumberInput(props) {
    const { inputRef, prefix, ...rest } = props;

    return (
        <Cleave
            ref={inputRef}
            options={{
                ...(prefix && { prefix: prefix }),
                numeral: true,
                numeralThousandsGroupStyle: 'none',
                numeralDecimalScale: 4,
                numeralPositiveOnly: true,
            }}
            {...rest}
            onChange={(e) => rest.onChange(e, (e.target.rawValue || "").replace(prefix || '', '').replace(',', ''))}
        />
    );
}

export function CleaveNoDecimalNumberInput(props) {
    const { inputRef, prefix, ...rest } = props;

    return (
        <Cleave
            ref={inputRef}
            options={{
                ...(prefix && { prefix: prefix }),
                numeral: true,
                numeralDecimalScale: 0,
                numeralPositiveOnly: true,
            }}
            {...rest}
            onChange={(e) => rest.onChange(e, (e.target.rawValue || "").replace(prefix || '', '').replace(',', ''))}
        />
    );
}


export function CleaveNumberInputPhone(props) {
    const { inputRef, prefix, ...rest } = props;

    return (
        <Cleave
            ref={inputRef}
            options={{
                blocks: [6],
                numericOnly: true,
                ...(prefix && { prefix: prefix }),
            }}
            {...rest}
            onChange={(e) => rest.onChange(e, (e.target.rawValue || "").replace(prefix || '', ''))}
        />
    );
}

export function TextOnlyInput({ onChange, value, ...rest }) {
    const handleChange = e => {
        const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '') // Remove anything that's not a letter or space
        onChange?.({ ...e, target: { ...e.target, value: lettersOnly } })
    }

    return <input type='text' value={value} onChange={handleChange} {...rest} />
}