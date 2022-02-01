import { Component } from "react";
import type { HandleProps } from "../../types/handles";





const Handle = () => {
  return null
}


class SourceHandle extends Component<HandleProps>{


  render() {
    const { id, type } = this.props
    return <div
      id={id}
      className={"tail-handle " + type}
    >

    </div>
  }
}



class TargetHandle extends Component<HandleProps> {


  render() {
    const { id, type } = this.props
    return <div
      id={id}
      className={"tail-handle " + type}
    >

    </div>
  }
}



export default Handle