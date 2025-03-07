import React, { Dispatch, SetStateAction } from "react"

import Screenshot from "src/assets/icons/Screenshot.svg"
import { Modal } from "src/components/Modal"

import classes from "./Notification.module.scss"

type Props = {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
}

const Notification: React.FC<Props> = ({ isActive, setIsActive }) => {
  return (
    <Modal isNotification isActive={isActive} setIsActive={setIsActive}>
      <div className={classes.notificationContainer}>
        <div className={classes.screenshotContainer}>
          <img src={Screenshot} alt="Screenshot" />
          <p>Screenshots are not Secure</p>
        </div>
        <p className={classes.description}>
          If you take a screenshot, your recovery phrase may be viewed by other apps. You can make a safe
          backup with physical paper and a pen.
        </p>
      </div>
    </Modal>
  )
}

export default Notification
