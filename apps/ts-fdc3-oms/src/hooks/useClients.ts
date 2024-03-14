import { GlueContext } from '@glue42/react-hooks'
import { useContext, useEffect, useState } from 'react'
import { METHODNAME_GET_CLIENTS } from '../constants/methods'
import { ClientInfo } from '../models/clients'

export const useClients = (): ClientInfo[] => {
    const glue = useContext(GlueContext)
    const [clients, setClients] = useState<ClientInfo[]>([])

    useEffect(() => {
        glue.interop
            .invoke(METHODNAME_GET_CLIENTS)
            .then((result) => setClients(result.returned?.clients))
            .catch((error) => {
                console.error(
                    `Failed invoking ${METHODNAME_GET_CLIENTS}. Error: `,
                    error
                )
            })
    }, [glue])

    return clients
}
