import React, { useContext } from "react"

import InfoGrayIcon from "src/assets/icons/InfoGray.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { Select } from "src/components/Select"
import { Switch } from "src/components/Switch"
import { BadgeColorsEnum, wordCountOptions } from "src/constants/index"
import { GenerateContext } from "src/context/generateContext"

import classes from "./GenerateContent.module.scss"

export const GenerateContentSettings: React.FC = () => {

  const {
    selectedWordCount,
    setSelectedWordCount,
    isAdvanced,
    setIsAdvanced,
    setEntropyValue,
  } = useContext(GenerateContext);

  const handleWordCountChange = (wordCountValue: "12" | "24") => {
    setEntropyValue("")
    setSelectedWordCount(wordCountValue)
  }

  return (
    <>
      <div className={classes.headerContainer} style={{ marginBottom: "3.6rem" }}>
        <BadgeTitle
          title="Seed Type"
          additionalInfo="BIP 39"
          color={BadgeColorsEnum.SuccessLight}
          style={{ marginBottom: 0 }}
        />
        <div className={classes.wordCountContainer}>
          <p>Word number count:</p>
          <Select
            defaultValue={selectedWordCount}
            onChange={handleWordCountChange}
            options={wordCountOptions}
          />
        </div>
      </div>
      <div className={classes.configContainer}>
        <div
          className={classes.configLabelContainer}
          title={"Don't trust the randsomness of a computer? You can enter your own entropy here."}
        >
          <p>
            Advanced Toolset - <span className={classes.entropyGeneration}>Entropy Generation</span>
          </p>
          <img src={InfoGrayIcon} alt="Info" style={{ marginLeft: "0.5rem" }} />
        </div>
        <Switch checked={isAdvanced} onChange={setIsAdvanced} />
      </div>
      <div className={classes.blockDivider} />
    </>
  )
}
