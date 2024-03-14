import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap'
import { useState } from 'react'
import { Fdc3Instrument } from '../../models/fdc3-instrument'
import { useFdc3Instruments } from '../../hooks/useFdc3Instruments'

interface SecuritiesDropdownParam {
    onClickCallback: CallableFunction
    disabled: boolean
}

const SecuritiesDropdown = ({
    onClickCallback,
    disabled,
}: SecuritiesDropdownParam): JSX.Element => {
    const instruments = useFdc3Instruments()
    const [dropdownOpen, toggleDropdown] = useState(false)

    return (
        <>
            <div
                data-toggle="tooltip"
                data-placement="bottom"
                title={disabled ? 'Please create a watchlist first' : ''}
            >
                <Dropdown
                    direction="down"
                    isOpen={dropdownOpen}
                    toggle={() => toggleDropdown((prevState) => !prevState)}
                >
                    <DropdownToggle disabled={disabled} caret color="primary">
                        Add security
                    </DropdownToggle>
                    <DropdownMenu
                        style= {{
                          overflow: 'auto',
                          maxHeight: '150px'
                        }}
                    >
                        {dropdownOpen
                            ? instruments?.instruments.map(
                                  (instrument: Fdc3Instrument, index) => {
                                      return (
                                          <DropdownItem
                                              onClick={() =>
                                                  onClickCallback(instrument)
                                              }
                                              key={index}
                                          >
                                              {`${instrument.id?.ticker} ${instrument.id?.BBG_EXCHANGE}`}
                                          </DropdownItem>
                                      )
                                  }
                              )
                            : null}
                        <DropdownItem divider />
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}

export default SecuritiesDropdown
