const unique = (items: string[]) => [...new Set(items)];

export const pushToBbgWorksheet = async (
  instruments: string[] | undefined,
  glue: any,
  worksheetName: string,
): Promise<void> => {
  if (!instruments || instruments.length === 0) {
    console.log("pushToBbgWorksheet() No instrument passed");
    return;
  }

  try {
    const result = await glue?.interop.invoke('T42.BBG.GetWorksheets')
    const worksheets = result?.returned.worksheets
    let worksheetId = worksheets.find((worksheet: any) => worksheet.name === worksheetName)?.id
    if (!worksheetId) {
      const result = await glue?.interop.invoke("T42.BBG.CreateWorksheet", { name: worksheetName, securities: [] });
      worksheetId = result?.returned.worksheet.id;
    }

    const securities = unique(instruments)
      .map((instr) => instr.replace(":", " ").concat(" Equity"));

    console.log(`Append [${securities.join(', ')}] to worksheetId ${worksheetId}`);
    await glue?.interop.invoke('T42.BBG.AppendWorksheetSecurities', {
      securities,
      worksheetId,
    })   
  } catch (error) {
    console.error('pushToBbgWorksheet() failed. Error: ', error)
  }
}