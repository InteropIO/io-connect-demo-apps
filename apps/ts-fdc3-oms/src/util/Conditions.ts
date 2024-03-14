import { GlueApiT } from "./glueTypes"

type ConditionFunction = (...args: any[]) => Promise<boolean> | boolean

// create evaluation primitives
const getNever = (bNegated = false): ConditionFunction => {
  if (bNegated) return () => true
  else return () => false
}

const getAlways = (bNegated = false): ConditionFunction => {
  return getNever(!bNegated)
}

const getInWorkspace = (glue: GlueApiT, bNegated = false): ConditionFunction => {
  const wsApi = glue.workspaces
  if (!wsApi) return getNever(bNegated)

  if (bNegated) {
    return async () => !(await wsApi.inWorkspace().catch(console.error))
  }
  return async () => !!(await wsApi.inWorkspace().catch(console.error))
}

const getOnChannel = (glue: GlueApiT, bNegated = false): ConditionFunction => {
  const channelsApi = glue.channels
  if (!channelsApi) return getNever(bNegated)

  if (bNegated) {
    return async () => !channelsApi.my()
  }
  return async () => !!channelsApi.my()
}

const getWithChannelSelector = async (
  glue: GlueApiT,
  bNegated = false
): Promise<ConditionFunction> => {
  const myWindow = glue.windows?.my()
  const channelsApi = glue.channels
  if (!myWindow || !channelsApi) return getNever(bNegated)

  const result = await glue.interop
    .invoke("T42.Channels.Announce", {
      command: "getChannelsInfo",
      data: {
        filter: {
          windowIds: [myWindow.id],
        },
      },
    })
    .catch(console.error)
  const nWindows = result?.returned.windows?.length

  // return fixed result - this is not going to change during the lifetime of the window
  if (nWindows === 1) return getAlways(bNegated)
  else return getNever(bNegated)
}

// helpers
const getFlattenedProperties = (obj: any, path: string, nesting: number): Record<string, any> => {
  if (nesting > 10) {
    console.error(`Nesting is too deep: >${nesting}. Check for circular references.`, obj)
    return {}
  }
  const result: Record<string, any> = {}
  const pathPrefix = path + (path.length > 0 ? "." : "")
  for (const [key, value] of Object.entries(obj)) {
    const valueType = typeof value
    const keyPath = (pathPrefix + key).toLocaleLowerCase()
    if (valueType === "string") {
      result[keyPath] = value
      continue
    }
    if (valueType === "object") {
      Object.assign(result, getFlattenedProperties(value, keyPath, nesting + 1))
      continue
    }
    console.warn(`Unknown property "${key}" of type "${valueType} under "${path}"`)
  }
  return result
}

// classes
class SimpleCondition {
  private conditions: ConditionFunction[] | undefined
  private conditionText: string
  private manager: ConditionManager

  constructor(myManager: ConditionManager, myConditionText: string) {
    this.conditionText = myConditionText
    this.manager = myManager
    this.evaluate = this.evaluateLazy
  }

  public async initCondition(): Promise<boolean> {
    const conditions = await this.manager.primitiveConditionsFromString(this.conditionText)
    if (conditions) {
      this.conditions = conditions
      this.evaluate = this.evaluateFinal
      return true
    }
    return false
  }

  public evaluate: ConditionFunction

  private async evaluateLazy(): Promise<boolean> {
    //console.log(`evaluateLazy(${this.conditionText})`)
    if (!(await this.initCondition())) {
      console.warn(`Returning "false" for non-initialized condition`)
      return false
    }
    return this.evaluate()
  }

  private async evaluateFinal(): Promise<boolean> {
    //console.log(`evaluateFinal(${this.conditionText})`)
    for (const cond of this.conditions || []) {
      if (!(await cond.apply(undefined))) return false
    }
    return true
  }
}

type PrimitivesDictionary = Record<string, ConditionFunction>
class ConditionManager {
  private primitives: PrimitivesDictionary | undefined = undefined
  private initPrimitivesPromise: Promise<boolean> | undefined = undefined
  private namedConditions: Record<string, SimpleCondition> = {}

  private glue: GlueApiT | undefined
  private initPromise: Promise<any>
  private initPromiseResolver: (result: any) => void
  private initStarted = false

  constructor() {
    this.initPromiseResolver = () => {
      console.error("ConditionManager: init promise resolved prematurely")
    }
    this.initPromise = this.createInitPromise()
  }

  private createInitPromise() {
    let resolver: any
    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject("ConditionManager init promise timed out")
      }, 20000)
      resolver = (arg: any) => {
        clearTimeout(timeout)
        resolve(arg)
      }
    })
    this.initPromiseResolver = resolver
    return promise
  }

  public async setInitializer(myGlue: GlueApiT, myInitializer: () => Promise<any>) {
    if (this.initStarted) return
    this.initStarted = true
    this.glue = myGlue
    this.getPrimitives()
    const result = await myInitializer()
    this.initPromiseResolver(result)
    console.log("ConditionManager initialization complete")
  }

  public getGlue() {
    return this.glue
  }

  public async waitInit() {
    await this.initPromise?.catch(console.error)
  }

  public async getPrimitives(): Promise<PrimitivesDictionary | undefined> {
    if (!this.initPrimitivesPromise) {
      this.initPrimitivesPromise = this.initPrimitivesInternal()
    }
    if (!(await this.initPrimitivesPromise)) this.initPrimitivesPromise = undefined

    return this.primitives
  }

  private async initPrimitivesInternal(): Promise<boolean> {
    const glue = this.glue
    if (!glue) return false
    this.primitives = {}
    this.primitives["always"] = getAlways()
    this.primitives["never"] = getNever()
    this.primitives["inWorkspace"] = getInWorkspace(glue)
    this.primitives["!inWorkspace"] = getInWorkspace(glue, true)
    this.primitives["onChannel"] = getOnChannel(glue)
    this.primitives["!onChannel"] = getOnChannel(glue, true)
    this.primitives["withChannelSelector"] = await getWithChannelSelector(glue)
    this.primitives["!withChannelSelector"] = await getWithChannelSelector(glue, true)
    console.log(
      `ConditionManager: initialized primitives: ${Object.keys(this.primitives).join(",")}`
    )
    return true
  }

  public async conditionFromString(conditionText: string): Promise<SimpleCondition> {
    const condition = new SimpleCondition(this, conditionText)
    await condition.initCondition()
    return condition
  }

  public async primitiveConditionsFromString(
    conditionText: string
  ): Promise<ConditionFunction[] | undefined> {
    const primitives = await this.getPrimitives()
    if (!primitives) return undefined

    const result: ConditionFunction[] = []
    const primitiveStrings = conditionText.split(/\s*&&?\s*/)
    for (const p of primitiveStrings) {
      const pf = primitives[p]
      if (!pf) {
        console.error(`Unknown primitive condition ${p} ignored`)
        continue
      }
      result.push(pf)
    }
    if (result.length === 0) {
      console.warn(`Setting "never" for empty condition`)
      result.push(primitives["never"])
    }
    return result
  }

  public async addConditionsFromConfigObject(cfgobj: any) {
    const flat = getFlattenedProperties(cfgobj, "", 0)
    for (const [key, value] of Object.entries(flat)) {
      await this.addReplaceCondition(key, value)
    }
  }

  public async addReplaceCondition(name: string, conditionText: string) {
    if (!name) return
    name = name.toLowerCase()
    this.namedConditions[name] = await this.conditionFromString(conditionText)
    console.log(`Condition added "${name}" => "${conditionText}"`)
  }

  public async evaluateCondition(name: string) {
    await this.waitInit()
    name = name?.toLowerCase()
    const condition = this.namedConditions[name]
    if (!condition) {
      console.warn(`Returning "false" on missing condition "${name}"`)
      return false
    }
    return condition.evaluate()
  }
}

const conditionManagerSingleton = new ConditionManager()
//;(window as any).condMan = conditionManagerSingleton
export default conditionManagerSingleton
