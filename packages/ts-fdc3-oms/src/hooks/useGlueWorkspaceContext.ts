import { useEffect, useState } from "react"
import { GlueApiT, GlueWorkspaceWindowT } from "../util/glueTypes"
import useGlueContext from "./useGlueContext"

type AnyFunction = (...args: any[]) => any

type Setters = {
  setContextName: AnyFunction
  setWorkspaceId: AnyFunction
}

interface WindowRemovedArg {
  windowId?: string | undefined
  workspaceId: string
  frameId: string
}

const obtainContextName = (workspaceId: string): string => {
  return "___workspace___" + workspaceId
}
const handleWindowAdded = async (glue: GlueApiT, win: GlueWorkspaceWindowT, s: Setters) => {
  if (win?.id !== glue?.windows.my().id) {
    return
  }
  console.log("added to workspace:", win.workspaceId)
  s.setWorkspaceId(win.workspaceId)
  s.setContextName(obtainContextName(win.workspaceId))
}

const handleWindowRemoved = async (glue: GlueApiT, { windowId }: WindowRemovedArg, s: Setters) => {
  if (windowId !== glue?.windows.my().id) {
    return
  }
  console.log("removed from workspace")
  s.setWorkspaceId("")
}

const useGlueWorkspaceContext = (glue: GlueApiT | undefined): [any, string, string] => {
  const [contextName, setContextName] = useState<string>("")
  const [contextData] = useGlueContext(glue, contextName)
  const [workspaceId, setWorkspaceId] = useState<string>("")

  // window added and removed subscriptions
  useEffect(() => {
    if (!glue) return
    let unsubPromiseAdded: Promise<AnyFunction> | undefined = undefined
    let unsubPromiseRemoved: Promise<AnyFunction> | undefined = undefined
    try {
      console.log(`Subscribing to workspaces window added`)
      unsubPromiseAdded = glue.workspaces?.onWindowAdded((w) => {
        handleWindowAdded(glue, w, { setContextName, setWorkspaceId })
      })
      console.log(`Subscribing to workspaces window removed`)
      unsubPromiseRemoved = glue.workspaces?.onWindowRemoved((arg) => {
        handleWindowRemoved(glue, arg, { setContextName, setWorkspaceId })
      })
    } catch (e) {
      console.error(e)
    }
    return () => {
      unsubPromiseAdded
        ?.then((unsubscribe) => {
          console.log(`Unsubscribing from workspaces window added`)
          unsubscribe()
        })
        .catch(console.error)
      unsubPromiseRemoved
        ?.then((unsubscribe) => {
          console.log(`Unsubscribing from workspaces window removed`)
          unsubscribe()
        })
        .catch(console.error)
    }
  }, [glue])

  // initial workspace detection
  useEffect(() => {
    ;(async () => {
      const myWs = await glue?.workspaces?.getMyWorkspace().catch((e) => null)
      if (myWs) {
        setWorkspaceId(myWs.id)
        setContextName(obtainContextName(myWs.id))
      }
    })()
  }, [glue])

  return [contextData, workspaceId, contextName]
}

export default useGlueWorkspaceContext
