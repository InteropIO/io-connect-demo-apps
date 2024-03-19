import { GlueT } from './glue'
import { formatInstrument } from './util'

const unique = (instruments: { ticker: string; bbgExchange: string }[]) =>
    Object.values<{ ticker: string; bbgExchange: string }>(
        instruments.reduce(
            (acc, instr) => ({ ...acc, [instr.ticker]: instr }),
            {}
        )
    )

export const pushToBbgWorksheet = async (
    instruments: { ticker: string; bbgExchange: string }[] | undefined,
    glue: GlueT | undefined,
    worksheetName: string
): Promise<void> => {
    if (!instruments || instruments.length === 0) {
        console.log('pushToBbgWorksheet() No instrument passed')
        return
    }

    try {
        const result = await glue?.interop.invoke('T42.BBG.GetWorksheets')
        const worksheets = result?.returned.worksheets
        let worksheetId = worksheets?.find(
            (worksheet: any) => worksheet.name === worksheetName
        )?.id
        if (!worksheetId) {
            const result = await glue?.interop.invoke(
                'T42.BBG.CreateWorksheet',
                { name: worksheetName, securities: [] }
            )
            worksheetId = result?.returned?.worksheet?.id
        }

        const securities = unique(instruments).map(
            ({ ticker, bbgExchange }) =>
                `${formatInstrument(ticker, bbgExchange)} Equity`
        )

        console.log(
            `Append [${securities.join(', ')}] to worksheetId ${worksheetId}`
        )
        await glue?.interop.invoke('T42.BBG.AppendWorksheetSecurities', {
            securities,
            worksheetId,
        })
    } catch (error) {
        console.error('pushToBbgWorksheet() failed. Error: ', error)
    }
}
