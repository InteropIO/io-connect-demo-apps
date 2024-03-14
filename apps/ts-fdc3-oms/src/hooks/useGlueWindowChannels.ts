import { useEffect, useState } from 'react'
import { GlueApiT, GlueChannelContextT } from '../util/glueTypes'

type AnyFunction = (...args: any[]) => any

const useGlueWindowChannels = (glue: GlueApiT | undefined): [any, any, string | undefined] => {
  const [channelData, setChannelData] = useState<any>()
  const [contextData, setContextData] = useState<GlueChannelContextT | undefined>()
  const [updaterId, setUpdaterId] = useState<string | undefined>()

  useEffect(() => {
    if (!glue) return
    let unsubscribe: AnyFunction | undefined = undefined
    try {
      console.log(`Subscribing to window channels`)
      unsubscribe = glue.channels.subscribe(channelHandler)
    } catch (e) {
      console.error(e)
    }
    return () => {
      console.log(`Unsubscribing from window channels`)
      unsubscribe?.()
    }
  }, [glue])

  const channelHandler = (data: any, context: GlueChannelContextT, updaterId: string) => {
    setChannelData(data)
    setContextData(context)
    setUpdaterId(updaterId)
  }

  return [channelData, contextData, updaterId]
}

export default useGlueWindowChannels
