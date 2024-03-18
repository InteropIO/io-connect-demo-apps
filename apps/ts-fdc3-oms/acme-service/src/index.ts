import AcmeService from './acmeService'

const start = async (glue: any): Promise<any> => {
    const service = new AcmeService(glue)
    await service.initialize()
}

// as a default export, "start" will be exposed as "AcmeService" - see webpack.config.js
export default start
