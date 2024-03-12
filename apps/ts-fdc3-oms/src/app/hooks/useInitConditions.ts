import { useEffect } from "react"
import conditionManager from "../util/Conditions"
import { GlueApiT } from "../util/glueTypes"

const DEFAULT_CONDITION_SETTINGS = {
  "sync.instrument.in.channel": "onChannel",
  "sync.instrument.in.wscontext": "!onChannel && inWorkspace",
  "sync.instrument.in.globalcontext": "!onChannel && !inWorkspace",
  "sync.instrument.out.channel": "onChannel",
  "sync.instrument.out.wscontext": "!onChannel && inWorkspace",
  "sync.instrument.out.globalcontext": "!onChannel && !inWorkspace",  
}

const initConditionManager = async () => {
  const glue = conditionManager.getGlue() as GlueApiT
  const customProps = glue.appManager?.myInstance?.application?.userProperties?.custom
  const fromAppDef = customProps?.conditions
  const mergeWithDefault = customProps?.conditionsMergeDefault
  let config = { ...DEFAULT_CONDITION_SETTINGS }
  if (fromAppDef) {
    if (mergeWithDefault) {
      console.log("Merging custom conditions settings over defaults")
      Object.assign(config, fromAppDef)
    } else {
      console.log("Using custom condition settings")
      config = { ...fromAppDef }
    }
  } else {
    console.log("Using default condition settings")
  }
  await conditionManager.addConditionsFromConfigObject(config)
}

const useInitConditions = (glue: GlueApiT | undefined) => {
  useEffect(() => {
    if (!glue) return
    conditionManager.setInitializer(glue, initConditionManager)
  }, [glue])
}

export default useInitConditions
