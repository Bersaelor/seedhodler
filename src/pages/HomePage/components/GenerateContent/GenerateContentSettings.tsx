import React, { Dispatch, SetStateAction } from "react"

import InfoGrayIcon from "src/assets/icons/InfoGray.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { Select } from "src/components/Select"
import { Switch } from "src/components/Switch"
import { BadgeColorsEnum, langOptions, wordCountOptions } from "src/constants/index"

import classes from "./GenerateContent.module.scss"

type GenerateContentSettingsProps = {
  selectedLang: string
  setSelectedLang: Dispatch<SetStateAction<string>>
  selectedWordCount: string
  setSelectedWordCount: Dispatch<SetStateAction<string>>
  isAdvanced: boolean
  setIsAdvanced: Dispatch<SetStateAction<boolean>>
  setEntropyValue: Dispatch<SetStateAction<string>>
}

export const GenerateContentSettings: React.FC<GenerateContentSettingsProps> = ({
  selectedLang,
  setSelectedLang,
  selectedWordCount,
  setSelectedWordCount,
  isAdvanced,
  setIsAdvanced,
  setEntropyValue,
}) => {
  const handleWordCountChange = (wordCountValue: string) => {
    setEntropyValue("")
    setSelectedWordCount(wordCountValue)
  }

  return (
    <>
      <BadgeTitle title="Seed Type" additionalInfo="BIP 39" color={BadgeColorsEnum.SuccessLight} />
      <div className={classes.configContainer}>
        <div>
          <p className={classes.title}>Language</p>
          <Select
            defaultValue={selectedLang}
            onChange={(selectedLangValue: string) => setSelectedLang(selectedLangValue)}
            options={langOptions}
          />
        </div>
        <div>
          <p className={classes.title}>Word Count</p>
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
