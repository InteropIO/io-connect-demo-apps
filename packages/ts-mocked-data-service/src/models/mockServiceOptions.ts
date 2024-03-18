export interface MockServiceOptions {
    mockToday?: Date | undefined
    tradeOpenHours?: string
    tradeCloseHours?: string
    maxOrdersPerDay?: string | number
}