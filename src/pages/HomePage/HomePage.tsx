import React, { lazy, Suspense, useContext, useEffect, useState } from "react"

import GenerateIcon from "src/assets/icons/GenerateWithBg.svg"
import RestoreIcon from "src/assets/icons/RestoreWithBg.svg"
import { DerivedAddressWrapper } from "src/components/DerivedAddrWrapper/DerivedAddrWrapper"
import { GenerateContext } from "src/context/generateContext"
import { RestoreContext } from "src/context/restoreContext"
import { generateMnemonicFromEntropy, restoreMnemonic, validateMnemonic } from "src/helpers"

import { Tab } from "./components/Tab"
import classes from "./HomePage.module.scss"
const GenerateContent = lazy(() => import("./components/GenerateContent"))
const RestoreContent = lazy(() => import("./components/RestoreContent"))

const HomePage: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(0)
  const {
    selectedWordCount,
    entropyToPass,
    selectedLang,
    minBits,
    thresholdNumber,
    sharesNumber,
    mnemonic12,
    setMnemonic12,
    mnemonic24,
    setMnemonic24,
    shares12,
    shares24,
    handleGenerateShares,
  } = useContext(GenerateContext)
  const {
    shareLength,
    selectedWordCount: selectedWordCountRestore,
    enteredSharesAsString,
    enteredShares,
    setInfoMessage,
    setActiveShareItemId,
    setCurrentShare,
    setEnteredShares,
    setRestoredMnemonic,
  } = useContext(RestoreContext)

  const is12wordsGenerate = selectedWordCount === "12"
  const shares = is12wordsGenerate ? shares12 : shares24
  const mnemonic = is12wordsGenerate ? mnemonic12 : mnemonic24

  // Generate effects
  useEffect(() => {
    if (entropyToPass.length >= minBits) {
      const mnemonic = generateMnemonicFromEntropy(selectedLang, entropyToPass)
      const mnemonicArr = mnemonic.split(" ")
      if (is12wordsGenerate) {
        setMnemonic12(mnemonicArr)
      } else {
        setMnemonic24(mnemonicArr)
      }
    }
  }, [selectedLang, entropyToPass])

  useEffect(() => {
    if (shares && validateMnemonic(mnemonic.join(" "))) {
      handleGenerateShares()
    }
  }, [thresholdNumber, sharesNumber, mnemonic12, mnemonic24])

  // Restore effects
  useEffect(() => {
    setInfoMessage("")
    setActiveShareItemId(0)
    setCurrentShare(new Array(shareLength).fill(""))
    setEnteredShares([])
    setRestoredMnemonic(new Array(+selectedWordCountRestore).fill(""))
  }, [shareLength, selectedWordCountRestore])

  useEffect(() => {
    if (enteredSharesAsString.length > 0) {
      const restoreResult = restoreMnemonic(enteredSharesAsString)
      if (restoreResult.error) {
        //@ts-ignore
        const neededSplitNumber = restoreResult.error.split(" ")[5]
        setInfoMessage(
          `${enteredShares.length} of ${neededSplitNumber} splits added - ${neededSplitNumber - enteredShares.length
          } splits remaining`,
        )
      } else {
        //@ts-ignore
        setRestoredMnemonic(restoreResult.mnemonic.split(" "))
        setInfoMessage(`${enteredShares.length} of ${enteredShares.length} splits added`)
      }
    }
  }, [enteredShares, enteredSharesAsString])

  return (
    <>
      <div className={classes.tabsContainer}>
        <Tab
          title="Generate"
          desc="Generate a BIP39 Master Seed and split it into shares"
          icon={GenerateIcon}
          active={activeTabId === 0}
          onClick={() => setActiveTabId(0)}
        />
        <Tab
          title="Restore"
          desc="Combine enough shares to retrieve your Master Seed"
          icon={RestoreIcon}
          active={activeTabId === 1}
          onClick={() => setActiveTabId(1)}
        />
      </div>
      <div className={classes.tabContent}>
        {activeTabId === 0 ?
          <Suspense><GenerateContent /></Suspense> :
          <Suspense><RestoreContent /></Suspense>}
      </div>
      <DerivedAddressWrapper />
    </>
  )
}

export default HomePage
