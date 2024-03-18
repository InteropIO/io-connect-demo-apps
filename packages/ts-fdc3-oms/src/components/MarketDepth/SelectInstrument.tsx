import { FormGroup } from 'reactstrap'
import Select from 'react-select'
import { useFdc3Instruments } from '../../hooks/useFdc3Instruments'
import { Fdc3InstrumentId } from '../../models/fdc3-instrument'

const selectStyles = {
    menu: (styles: any) => {
        return {
            ...styles,
            minWidth: "6rem",
        }
    },
    menuList: (styles: any) => {
        return {
            ...styles,
            maxHeight: "9rem",
        }
    },
}

const SelectInstrument = (props: SelectInstrumentProps): JSX.Element => {
    const instruments = useFdc3Instruments()

    const instrumentOptions = instruments?.instruments?.map((instrument) => {
        return {
            label: instrument.id?.RIC,
            value: instrument.id,
        }
    })

    const selectProps: any = { value: {} }
    if (props.instrument?.RIC) {
        selectProps.value = {
            label: props.instrument.RIC,
            value: props.instrument,
        }
    }

    return (
        <FormGroup>
            <Select
                classNamePrefix="select"
                className="flex-grow-1 market-depth-select"
                id={'security'}
                name={'security'}
                options={instrumentOptions}
                styles={selectStyles}
                placeholder="Security"
                onChange={(event: any) => {
                    props.onChange(event.value)
                }}
                {...selectProps}
            />
        </FormGroup>
    )
}

export default SelectInstrument

export interface SelectInstrumentProps {
    onChange: (value: any) => void
    instrument?: Fdc3InstrumentId
}
