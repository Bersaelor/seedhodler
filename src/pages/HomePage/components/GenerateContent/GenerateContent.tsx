import React, { useContext } from "react"

import { Button } from "src/components/Button"
import { GenerateContext } from "src/context/generateContext"

import classes from "./GenerateContent.module.scss"
import { GenerateContentAdvanced } from "./GenerateContentAdvanced"
import { GenerateContentSettings } from "./GenerateContentSettings"
import { GenerateContentShares } from "./GenerateContentShares"

const GenerateContent: React.FC = () => {
  const {
    isAdvanced,
    handleGeneratePhase,
  } = useContext(GenerateContext)

  return (
    <div className={classes.tabContent}>
      <GenerateContentSettings />
      {isAdvanced ? (
        <GenerateContentAdvanced />
      ) : (
        <Button fullWidth style={{ marginBottom: "3.4rem" }} onClick={handleGeneratePhase}>
          Generate Master Seed
        </Button>
      )}
      <GenerateContentShares />
    </div>
  )
}

export default GenerateContent
