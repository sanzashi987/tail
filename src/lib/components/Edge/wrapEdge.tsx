import React, { ComponentType, PureComponent } from "react";
import type { EdgeProps, EdgeWrpperProps } from "@app/types";

const wrapEdge = (EdgeComponent: ComponentType<EdgeProps>) => {
  const EdgeWrapper = class extends PureComponent<EdgeWrpperProps>{
    onClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      const { onClick, edge } = this.props
      onClick?.(e, edge)
    }

    render() {
      const { onClick, ...edgeProps } = this.props
      return <g
        onClick={this.onClick}
      >
        <EdgeComponent
          {...edgeProps}
        />
      </g>
    }
  }

  return EdgeWrapper
}


export default wrapEdge
