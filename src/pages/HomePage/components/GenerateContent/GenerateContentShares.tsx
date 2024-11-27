import * as bip39 from "bip39"
import React, { useContext, useMemo, useState } from "react"

import { BadgeTitle } from "src/components/BadgeTitle"
import { Button } from "src/components/Button"
import { Calc } from "src/components/Calc"
import { InfoTitle } from "src/components/InfoTitle"
import { Input } from "src/components/Input"
import { BadgeColorsEnum, ButtonColorsEnum } from "src/constants/index"
import { GenerateContext } from "src/context/generateContext"
import { useInputRefs } from "src/hooks"

import { ExportSaveModal } from "../ExportSaveModal"
import { Shares } from "../Shares"
import classes from "./GenerateContent.module.scss"

export const GenerateContentShares: React.FC = () => {
  const {
    selectedLang,
    selectedWordCount,
    activeShareItemId,
    setActiveShareItemId,
    thresholdNumber,
    setThresholdNumber,
    sharesNumber,
    setSharesNumber,
    splitMnemonicIntoShares,
    hasEmptyWord,
    isValidMnemonic,
    shares,
    mnemonic,
    setMnemonic
  } = useContext(GenerateContext)

  const [isExportSaveModalActive, setIsExportSaveModalActive] = useState(false)
  const inputRefs = useInputRefs(+selectedWordCount)

  const onEnter = (index: number) => {
    if (index < +selectedWordCount - 1) {
      inputRefs[index + 1].current.focus()
    }
  }

  const onClick = (index: number) => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      inputRefs[index].current.scrollIntoView()
    }
  }

  const isLastWordLongEnough = useMemo(() => mnemonic[mnemonic.length - 1].length >= 3, [mnemonic])

  return (
    <>
      <p className={classes.title}>BIP39 Master Seed</p>
      <div
        className={classes.seedPhraseContainer}
        style={{ height: selectedWordCount === "12" ? "360px" : "720px" }}
      >
        {mnemonic.map((word, index) => (
          <Input
            totalWords={mnemonic.length}
            key={index}
            ref={inputRefs[index]}
            onEnter={onEnter}
            onClick={onClick}
            wordNr={index + 1}
            index={index}
            value={word}
            onChange={setMnemonic}
            wordlist={bip39.wordlists[selectedLang]}
            isError={!isValidMnemonic && !hasEmptyWord && isLastWordLongEnough}
            containerStyle={{
              width: "49%",
              marginBottom: "1.2rem",
              alignSelf: index >= +selectedWordCount / 2 ? "flex-end" : "flex-start",
            }}
          />
        ))}
      </div>

      {isValidMnemonic ? (
        <>
          <BadgeTitle title="Split Seed into Shares" color={BadgeColorsEnum.SuccessLight} />
          <p className={classes.sharesInfo}>
            The generated Master Seed can now be split into up to 16 different Shares. These can then be
            combined to restore your Master Seed
          </p>
          <div className={classes.thresholdSharesContainer}>
            <div className={classes.calcContainer}>
              <InfoTitle
                title="Threshold"
                desc="How many of the Shares should be required the original Master Seed"
                className={classes.calcTitle}
              />
              <Calc
                value={thresholdNumber}
                plusDisabled={thresholdNumber >= sharesNumber}
                minusDisabled={thresholdNumber <= 1}
                onPlus={() => setThresholdNumber(prev => ++prev)}
                onMinus={() => {
                  // only 1-of-1 member sharing allowed when threshold is 1
                  if (thresholdNumber === 2) {
                    setSharesNumber(1)
                  }
                  setThresholdNumber(prev => (prev <= 1 ? prev : --prev))
                }}
              />
            </div>
            <div className={classes.calcContainer}>
              <InfoTitle
                title="Shares"
                desc="How many of your split shares to generate in total"
                className={classes.calcTitle}
              />
              <Calc
                value={sharesNumber}
                plusDisabled={sharesNumber >= 16}
                minusDisabled={sharesNumber <= 1 || sharesNumber <= thresholdNumber}
                onPlus={() => {
                  // only 1-of-1 member sharing allowed when threshold is 1
                  if (sharesNumber === 1) {
                    setThresholdNumber(2)
                  }
                  setSharesNumber(prev => (prev >= 16 ? prev : ++prev))
                }}
                onMinus={() => setSharesNumber(prev => (prev <= 1 ? prev : --prev))}
              />
            </div>
          </div>
          {!shares && (
            <Button onClick={splitMnemonicIntoShares} fullWidth style={{ marginBottom: "3.6rem" }}>
              Split
            </Button>
          )}
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
            Print and verify
          </Button>
        </>
      ) : null
        // <div className={classes.whitespace} />
      }
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
