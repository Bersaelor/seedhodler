import CSS from "csstype"
import React from "react"

import { BadgeColorsEnum, badgeColorsObj } from "src/constants/index"

import classes from "./AdditionalInfo.module.scss"

type Props = {
  info: string
  color?: BadgeColorsEnum
  className?: string
  style?: CSS.Properties
}

const AdditionalInfo: React.FC<Props> = ({
  info,
  color = BadgeColorsEnum.SuccessLight,
  className,
  style,
}) => {
  const classNames = [classes.additionalInfo, className].join(" ")

  return (
    <span
      className={classNames}
      style={{
        ...style,
        backgroundColor: badgeColorsObj[color],
      }}
    >
      {info}
    </span>
  )
}

export default AdditionalInfo
