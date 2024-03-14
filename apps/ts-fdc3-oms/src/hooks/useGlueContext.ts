import { useEffect, useState } from 'react'
import { GlueApiT } from '../util/glueTypes'

type AnyFunction = (...args: any[]) => any

const useGlueContext = (glue: GlueApiT | undefined, contextName: string): [any] => {
  const [contextData, setContextData] = useState<any>(undefined)
  useEffect(() => {
    if (!glue) return
    let unsubscribePromise: Promise<AnyFunction> | undefined = undefined
    try {
      if (contextName) {
        // TODO: make sure the subscribe is done after a previous unsubscribe to prevent getting phantom updates
        console.log(`Subscribing to context ${contextName}`)
        unsubscribePromise = glue.contexts.subscribe(contextName, contextHandler)
      }
    } catch (e) {
      console.error(e)
    }
    return () => {
      unsubscribePromise
        ?.then((unsubscribe) => {
          console.log(`Unsubscribing from context ${contextName}`)
          unsubscribe()
        })
        .catch(console.error)
    }
  }, [glue, contextName])

  const contextHandler = (data: any /*, delta: any, removed: string[]*/) => {
    setContextData(data)
  }
  return [contextData]
}

export default useGlueContext
