const fdc3Key = 'fdc3_fdc3&instrument'

export const instrumentExtractor = (data: any): string | undefined => {
    if (!data) return undefined

    const fdc3Data = data[fdc3Key]
    if (fdc3Data) {
        return fdc3Data.id?.RIC
    }

    const id = data.id || data.instrument?.id
    return id?.RIC || ''
}
