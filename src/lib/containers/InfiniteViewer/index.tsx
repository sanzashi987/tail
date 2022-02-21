import React, { Component } from "react";




class InfiniteViewer extends Component {

  getScale() {
    return 0
  }

  render() {
    return <div>
      {this.props.children}
    </div>
  }
}


export default InfiniteViewer