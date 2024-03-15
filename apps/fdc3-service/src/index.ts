import FDC3Service from './fdc3Service'

const start = async (glue: any): Promise<any> => {
    const service = new FDC3Service(glue)
    await service.initialize()
}

// as a default export, "start" will be exposed as "AcmeService" - see webpack.config.js
export default start
