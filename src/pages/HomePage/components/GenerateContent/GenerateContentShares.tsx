import React, { Dispatch, SetStateAction, useState } from "react"

import { Calc } from "components/Calc"
import { BadgeTitle } from "components/BadgeTitle"
import { InfoTitle } from "components/InfoTitle"
import { Button } from "components/Button"
import { getFormattedShares, hexStringToByteArray, mnemonicToEntropy } from "helpers"
import { BadgeColorsEnum, ButtonColorsEnum } from "constants/index"
import { Shares } from "../Shares"
import { ExportSaveModal } from "../ExportSaveModal"

import classes from "./GenerateContent.module.scss"
import { Input } from "components/Input"

type GenerateContentSharesProps = {
  mnemonic: string[]
  shares: null | string[]
  selectedWordCount: string
  activeShareItemId: number
  setMnemonic: Dispatch<SetStateAction<string[]>>
  setShares: Dispatch<SetStateAction<null | string[]>>
  setActiveShareItemId: Dispatch<SetStateAction<number>>
}

export const GenerateContentShares: React.FC<GenerateContentSharesProps> = ({
  mnemonic,
  shares,
  selectedWordCount,
  activeShareItemId,
  setMnemonic,
  setShares,
  setActiveShareItemId,
}) => {
  const [thresholdNumber, setThresholdNumber] = useState(3)
  const [sharesNumber, setSharesNumber] = useState(5)
  const [isExportSaveModalActive, setIsExportSaveModalActive] = useState(false)

  const handleGenerateShares = () => {
    setActiveShareItemId(0)

    const mnemonicStr = mnemonic.join(" ")
    const groups = [[thresholdNumber, sharesNumber]]
    const masterSecret = hexStringToByteArray(mnemonicToEntropy(mnemonicStr))

    const shares = getFormattedShares(masterSecret, "", 1, groups)
    setShares(shares)
  }
  return (
    <>
      <InfoTitle title="BIP39 Seed Phrase" desc="BIP39 Seed Phrase __placeholder" />
      <div
        className={classes.seedPhraseContainer}
        style={{ height: selectedWordCount === "12" ? "360px" : "720px" }}
      >
        {mnemonic.map((word, index) => (
          <Input
            key={index}
            count={index + 1}
            index={index}
            value={word}
            onChange={setMnemonic}
            containerStyle={{
              width: "49%",
              marginBottom: "1.2rem",
              alignSelf: index >= +selectedWordCount / 2 ? "flex-end" : "flex-start",
            }}
          />
        ))}
      </div>
      {mnemonic.every(word => word.length !== 0) && (
        <>
          <BadgeTitle title="Split Phrase into shares" color={BadgeColorsEnum.SuccessLight} />
          <p className={classes.sharesInfo}>
            The generated Phrase can now be split into up to 6 different shares. These can then be
            combined to restore your Phrase
          </p>
          <div className={classes.thresholdSharesContainer}>
            <div className={classes.calcContainer}>
              <InfoTitle
                title="Threshold"
                desc="Threshold __placeholder"
                className={classes.calcTitle}
              />
              <Calc
                value={thresholdNumber}
                plusDisabled={thresholdNumber >= sharesNumber}
                minusDisabled={thresholdNumber <= 1}
                onPlus={() => setThresholdNumber(prev => ++prev)}
                onMinus={() => setThresholdNumber(prev => (prev <= 1 ? prev : --prev))}
              />
            </div>
            <div className={classes.calcContainer}>
              <InfoTitle title="Shares" desc="Shares __placeholder" className={classes.calcTitle} />
              <Calc
                value={sharesNumber}
                plusDisabled={sharesNumber >= 16}
                minusDisabled={sharesNumber <= 1 || sharesNumber <= thresholdNumber}
                onPlus={() => setSharesNumber(prev => (prev >= 16 ? prev : ++prev))}
                onMinus={() => setSharesNumber(prev => (prev <= 1 ? prev : --prev))}
              />
            </div>
          </div>
          <Button onClick={handleGenerateShares} fullWidth style={{ marginBottom: "3.6rem" }}>
            Split
          </Button>
          {shares && (
            <Shares
              shares={shares}
              activeShareItemId={activeShareItemId}
              setActiveShareItemId={setActiveShareItemId}
              selectedWordCount={+selectedWordCount}
            />
          )}
          <Button
            onClick={() => setIsExportSaveModalActive(true)}
            disabled={!Boolean(shares)}
            fullWidth
            color={ButtonColorsEnum.Success}
          >
            Export / Save Shares
          </Button>
        </>
      )}
      <ExportSaveModal
        isExportSaveModalActive={isExportSaveModalActive}
        setIsExportSaveModalActive={setIsExportSaveModalActive}
        selectedWordCount={+selectedWordCount}
        mnemonic={mnemonic}
        shares={shares!}
        sharesNumber={sharesNumber}
      />
    </>
  )
}
