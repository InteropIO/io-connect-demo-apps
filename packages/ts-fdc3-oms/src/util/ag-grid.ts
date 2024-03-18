import { GetContextMenuItemsParams, RowNode } from 'ag-grid-community'

export const getRelevantContextNodes = (params:GetContextMenuItemsParams) : RowNode[] => {
  const clickedNode = params.node
  let nodes: RowNode[] = params.api.getSelectedNodes()
  if(clickedNode) {
      if (nodes.findIndex(node=>node.id === clickedNode.id)<0) {
          nodes = [clickedNode]
      }
  }
  return nodes
}