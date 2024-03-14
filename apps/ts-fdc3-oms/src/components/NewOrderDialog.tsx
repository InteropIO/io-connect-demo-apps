import React, { useEffect, useRef } from 'react'
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Label,
    Input,
    Form,
} from 'reactstrap'
import { OrderInfo } from '../models/orders'
import startCase from 'lodash.startcase'

const getFormGroups = (
    trade: OrderInfo,
    onFieldChange: (field: string, value: any) => void
) => {
    return Object.entries(trade).map(([key, value]) => (
        <FormGroup key={key}>
            <Label for={key}>{startCase(key)}</Label>
            <Input
                id={key}
                name={key}
                type="text"
                value={value}
                onChange={(event) => onFieldChange(key, event.target.value)}
            />
        </FormGroup>
    ))
}

export default function TradeDialog(props: NewOrderDialogProps) {
    const { order, onSave, onCancel } = props
    const refOrder = useRef({ ...order })

    useEffect(() => {
        refOrder.current = { ...order }
    }, [order])

    const handlerOnSaveClick = () => {
        onSave(refOrder.current)
        refOrder.current = {} as any
    }

    const handlerOnCancelClick = () => {
        onCancel()
        refOrder.current = {} as any
    }

    const handleFieldChange = (field: string, value: string) => {
        console.log(field, value)
        ;(refOrder.current as any)[field] = value
    }

    return (
        <Modal size="md" isOpen={true} modalTransition={{ timeout: 0 }}>
            <ModalHeader>Order Entry</ModalHeader>
            <ModalBody>
                <Form>{getFormGroups(order, handleFieldChange)}</Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handlerOnSaveClick}>
                    Save
                </Button>
                <Button onClick={handlerOnCancelClick}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}

export interface NewOrderDialogProps {
    order: OrderInfo
    onSave: (order: OrderInfo) => void
    onCancel: () => void
}
