import { useCallback, useState } from 'react'
import NewTradeForm from './NewTradeForm'
import { Fdc3Trade } from '../../models/fdc3-trade'
import { useAddNewTradeIntentListener } from './hooks/hooks'
import { useCloseMyWindow } from '../../util/glue'

export default function NewTradePage(): JSX.Element {
  console.log("NewTradePage()")

  const [intentTrade, setIntentTrade] = useState<Fdc3Trade>();

  const onComplete = useCloseMyWindow();

  const handleNewTradeRequest = useCallback(
    (trade: Fdc3Trade) => {
      console.log("NewTradeIntent invoked")
      console.log(trade)
      setIntentTrade(trade)
    }, []
  );

  useAddNewTradeIntentListener(handleNewTradeRequest);

  return (
    <NewTradeForm intentTrade={intentTrade} onComplete={onComplete}/>
  )
}
