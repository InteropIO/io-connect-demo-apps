export const instrumentExtractor = (data: any): string | undefined => {
    if (!data) return undefined
    const id = data?.instrument?.id
    return id?.RIC || ""
  }
