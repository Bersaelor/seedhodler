import React, { Dispatch, SetStateAction } from "react"

import { HelpModalTabs } from "src/constants"
import classes from "./NavFeaturedCard.module.scss/"

type Props = {
  setIsActive: Dispatch<SetStateAction<boolean>>
  setIsHelpModalActive: Dispatch<SetStateAction<boolean>>
  setHelpModalStartTab: Dispatch<SetStateAction<number | null>>
}

const NavFeaturedCard: React.FC<Props> = ({
  setIsActive,
  setIsHelpModalActive,
  setHelpModalStartTab,
}) => {
  const handleMoreInfoButton = () => {
    setHelpModalStartTab(HelpModalTabs.Warning)
    setIsHelpModalActive(true)
    //uncomment if you need to close the window after opening HelpModal
    // setIsActive(false)
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.mainContentContainer}>
        <p className={classes.title}>
          Attention!
        </p>

        <p className={classes.supportingText}>
          Do not combine Seedhodler with other products, such as Trezor-generated shamir seeds.
          Please ensure you read this issue carefully before using this product.
        </p>
      </div>

      <button className={classes.actionButton} onClick={handleMoreInfoButton}>
        <p>More info</p>
      </button>
    </div>
  )
}

export default NavFeaturedCard
