import React, { Component } from "react";




class InfiniteViewer extends Component {



  render() {
    return <div>
      {this.props.children}
    </div>
  }
}


export default InfiniteViewer