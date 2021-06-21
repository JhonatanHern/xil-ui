import React, { Component } from "react"
import classNames from "classnames"

class DragAndDrop extends Component {
  state = {
    drag: false,
  }
  dropRef = React.createRef()
  handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true })
    }
  }
  handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter--
    if (this.dragCounter === 0) {
      this.setState({ drag: false })
    }
  }
  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ drag: false })
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files)
      e.dataTransfer.clearData()
      this.dragCounter = 0
    }
  }
  handleFileUploadViaClick = (e) => {
    let files = e.target.files
    if (files && files.length) {
      this.props.handleDrop(files)
    }
  }
  componentDidMount() {
    let div = this.dropRef.current
    div.addEventListener("dragenter", this.handleDragIn)
    div.addEventListener("dragleave", this.handleDragOut)
    div.addEventListener("dragover", this.handleDrag)
    div.addEventListener("drop", this.handleDrop)
  }
  componentWillUnmount() {
    let div = this.dropRef.current
    div.removeEventListener("dragenter", this.handleDragIn)
    div.removeEventListener("dragleave", this.handleDragOut)
    div.removeEventListener("dragover", this.handleDrag)
    div.removeEventListener("drop", this.handleDrop)
  }
  render() {
    var liClasses = classNames({
      "drag-and-drop": true,
      active: this.state.drag,
    })
    return (
      <div
        className={liClasses}
        style={{ display: "inline-block", position: "relative" }}
        ref={this.dropRef}
      >
        <img src="upload.svg" alt="" />
        <h2>
          Drop CVS file here <label for="file-input">or click here</label>
        </h2>
        <input
          type="file"
          id="file-input"
          onChange={this.handleFileUploadViaClick}
          style={{ display: "none" }}
        />
      </div>
    )
  }
}
export default DragAndDrop
