import CSS from "csstype"
import React, { useEffect, useRef, useState } from "react"

import ArrowDownIcon from "src/assets/icons/ArrowDown.svg"

import classes from "./Accordion.module.scss"

type Props = {
  label: string
  defaultIsActive?: boolean
  style?: CSS.Properties
  children: string | React.ReactNode
}

const Accordion: React.FC<Props> = ({ label, defaultIsActive, children, style }) => {
  const contentRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const [isActive, setIsActive] = useState(defaultIsActive || false)
  const [contentHeight, setContentHeight] = useState("0px")

  const contentClassNames = [classes.accordionContent]
  if (isActive) {
    contentClassNames.push(classes.animated)
  }

  useEffect(() => {
    setContentHeight(`${contentRef.current.scrollHeight}px`)
  }, [])

  return (
    <div className={classes.accordionContainer} style={style}>
      <button onClick={() => setIsActive(prev => !prev)} className={classes.accordionLabel}>
        <span>{label}</span>
        <img src={ArrowDownIcon} alt="Arrow down" className={isActive ? classes.active : ""} />
      </button>
      <div
        ref={contentRef}
        className={contentClassNames.join(" ")}
        style={{ height: isActive ? contentHeight : "0px" }}
      >
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Accordion
