import { ValueFormatterParams } from "ag-grid-community";

export const fmtDefaultDate = (params:ValueFormatterParams): string => {
  const date = params.value
  if(date instanceof Date) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return date.getFullYear() + "-" +
      (month < 10 ? "0" : "") + month + "-" +
      (day < 10 ? "0" : "") + day
  }
  return '';
}

export const fmtDefaultDateTime = (params:ValueFormatterParams): string => {
  const date = params.value
  if(date instanceof Date) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return date.getFullYear() + "-" +
      (month < 10 ? "0" : "") + month + "-" +
      (day < 10 ? "0" : "") + day + " " +
      (hours < 10 ? "0" : "") + hours + ":" +
      (minutes < 10 ? "0" : "") + minutes + ":" +
      (seconds < 10 ? "0" : "") + seconds
  }
  return '';
}