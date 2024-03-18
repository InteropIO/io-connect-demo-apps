export interface AcmeSettingsContext {
    mockTimeOffset?: number
    setProperty: (propertyPath:string, propertyValue:any) => any
}