import CSS from "csstype"
import React from "react"
import ContentCopy from "src/assets/icons/ContentCopy.svg"

import classes from "./ShareHeader.module.scss"

type Props = {
  text: string
  style?: CSS.Properties
  shareString: string
}

const ShareHeader: React.FC<Props> = ({ text, style, shareString }) => {
  return (
    <div className={classes.shareHeaderContainer} style={style}>
      <div className={classes.shareHeaderDot}></div>
      <p className={classes.shareHeaderText}>{text}</p>
      <button onClick={() => {
        navigator.clipboard.writeText(shareString)
      }}>
        <img src={ContentCopy} alt="ContentCopy" className={classes.logo} />
      </button>
    </div>
  )
}

export default ShareHeader
