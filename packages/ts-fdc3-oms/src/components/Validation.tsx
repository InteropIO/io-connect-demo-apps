import { Button } from 'reactstrap';

export default function Validation({ messages, onClose }: {messages:string[], onClose: any}): JSX.Element {
  return (
    <div className="d-flex justify-content-between nof-validation-element border-danger">
      <ul className="nof-validation-ul">
      {messages.map((message,index)=>{
        return (
          <li key={index}>{message}</li>
        )
      })}
      </ul>
      <div><Button onClick={()=>onClose(false)}>&#x2716;</Button></div>
    </div>
  )
}

