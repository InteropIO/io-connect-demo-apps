import { useState, useEffect, useContext } from 'react'
import { GlueContext } from '@glue42/react-hooks'
import '@glue42/theme/dist/packages/rc-select.css'
import Select, { components } from 'react-select'
import chroma from 'chroma-js'

import {sleep} from "../util/util"
import { Button } from 'reactstrap'

import { GlueT, GlueChannelContextT } from "../util/glue"

interface ChannelComboOption {
  value: string
  label: string
  color: string
}

const noneOption:ChannelComboOption = {
  value: "",
  label: 'None',
  color: "rgba(0,0,0,0)"
}

const listGlueChannels = async (glue:GlueT):Promise<GlueChannelContextT[]> => {
  if(!glue) return []
  let list = await glue?.channels.list()
  if (list) {
    for (let i = 0; i < 5; i++) {
      if (list.length > 0 && list[0].meta) break
      //console.log("Invalid channels returned",list)
      await sleep(500)
      list = await glue?.channels.list()
    }
  }
  if (!list || list.length === 0 || !list[0].meta) {
    return []
  }
  return list;
}

const getDisplaySelectedOption = (opt:ChannelComboOption):ChannelComboOption => ({
  value: opt.value,
  label: "☍",
  color: opt.color
})

const CustomSelectOption = (props:any): JSX.Element => {
  const backgroundColor = props?.data?.color || "rgba(0,0,0,0)"
  const bgColorChroma = chroma(backgroundColor)
  const color = !(props?.data?.value) ? "inherit"
    : (props.isSelected || props.isFocused) ? chroma.contrast(bgColorChroma, "white") > 2 ? "white" : "black"
    : backgroundColor

  return (
      <div
        style={{
          color,
          backgroundColor,
          textAlign:"center",
        }}>
        <components.Option {...props} />        
      </div>
  )
}

let baseSize = 1.4
const CustomSelectControl = (props:any) => {
  const selectedVal = props?.selectProps?.value
  const backgroundColor = selectedVal?.color || "rgba(0,0,0,0)"
  const bgColorChroma = chroma(backgroundColor)
  const color = !(selectedVal?.value) ? "inherit"
    : chroma.contrast(bgColorChroma, "white") > 2 ? "white" : "black"
 
   return (
    <Button
      style={{
        color,
        backgroundColor,
        lineHeight: baseSize + "rem",
        padding: "0 " + baseSize*.2 + "rem",
        fontSize: baseSize + "rem",
        cursor: "default",
        userSelect: "none",
      }}
      onClick={()=>{
        if (props.selectProps.menuIsOpen) {
          props.selectProps.onMenuClose()
        } else {
          props.selectProps.onMenuOpen()
        }
      }}
      onBlur={()=>{
        props.selectProps.onMenuClose()
      }}      
    >{selectedVal?.label}</Button>
  )
}

const ChannelSelector = (props:{baseSize?:number|null}): JSX.Element => {
  const [channelOptions,setChannelOptions] = useState<ChannelComboOption[]>([])
  const [selectedChannel,setSelectedChannel] = useState<ChannelComboOption>(getDisplaySelectedOption(noneOption))
  const glue:GlueT|undefined = useContext(GlueContext)
  props?.baseSize && (baseSize = props.baseSize)

  useEffect(() => {
    ;(async ()=>{
      const allChannels = await listGlueChannels(glue)
      console.log("All Channels",allChannels)
      const cOptions: ChannelComboOption[] = [noneOption]
      cOptions.push(...allChannels.map((c)=>{
        return {
          value: c.name,
          label: "✔",
          color: c.meta.color
        }
      }))
      
      setChannelOptions(cOptions)

    })()
  }, [glue])

  return (
    <div style={{}}>
    <Select classNamePrefix="select" className="channel-selector"
      components={{
        DropdownIndicator:() => null,
        IndicatorSeparator:() => null,
        Option: CustomSelectOption,
        Control: CustomSelectControl
       }}
      //isSearchable={false}
      styles={{
        menu:({...styles})=>({...styles, width:"4rem"}),
      }}
      options={channelOptions}
      value={selectedChannel}
      menuPlacement="auto"
      maxMenuHeight={640}
      onChange={(sel)=>{
        setSelectedChannel(getDisplaySelectedOption(sel as any))
      }}
      
    />
    </div>
  )
}

export default ChannelSelector
