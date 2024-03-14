import { GlueT } from '../../util/glue'

export const DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss'

export type PushExecutions = (
    orderId: string,
    dateCreated: Date | undefined
) => void
export const getTradesWithinDay = async (
    { interop }: GlueT,
    orderId: string,
    dateCreated: Date | undefined
): Promise<any> =>
    await interop
        .invoke('T42.OMS.GetOrder', {
            orderId,
            withTrades: true,
            date: dateCreated || new Date(),
        })
        .then(({ returned }) => ({
            order: returned?.order,
            trades: returned?.trades ?? [],
        }))
