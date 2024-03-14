import { useEffect } from 'react'
import { Button } from 'reactstrap'
import { useAcmeSettings } from '../hooks/useAcmeSettings'
import { fmtDefaultDateTime } from '../util/ag-value-formatters'
import { GlueApiT } from '../util/glueTypes'

const getMockTime = (date: Date, offset: number): Date => {
    return new Date(date.getTime() + offset)
}

export interface DateManipulatorProps {
    glue: GlueApiT | undefined
    time: Date
    timeOffset: number
    setTimeOffset: (...args: any[]) => any
}

const DateManipulator = ({
    glue,
    time,
    timeOffset,
    setTimeOffset,
}: DateManipulatorProps): JSX.Element => {
    const { mockTimeOffset, setProperty } = useAcmeSettings(glue)

    useEffect(() => {
        const newOffset =
            typeof mockTimeOffset === 'number' ? mockTimeOffset : 0
        setTimeOffset(newOffset)
    }, [mockTimeOffset, setTimeOffset])

    const moveTimeForward = (e: React.MouseEvent<HTMLButtonElement>) => {
        let amount = 60 * 1000
        if (e.ctrlKey) amount *= 60
        if (e.shiftKey) amount *= 24
        if (e.altKey) amount /= 60
        const newOffset = timeOffset + amount
        setProperty('mockTimeOffset', newOffset)
    }

    const moveTimeBackward = (e: React.MouseEvent<HTMLButtonElement>) => {
        let amount = 60 * 1000
        if (e.ctrlKey) amount *= 60
        if (e.shiftKey) amount *= 24
        if (e.altKey) amount /= 60
        const newOffset = timeOffset - amount
        setProperty('mockTimeOffset', newOffset)
    }

    const resetTime = () => {
        setProperty('mockTimeOffset', 0)
    }

    return (
        <div className="justify-content-end">
            <Button onClick={moveTimeBackward}>&lt;</Button>
            <Button onClick={resetTime}>
                {fmtDefaultDateTime({
                    value: getMockTime(time, timeOffset),
                } as any)}
            </Button>
            <Button onClick={moveTimeForward}>&gt;</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
    )
}

export default DateManipulator
