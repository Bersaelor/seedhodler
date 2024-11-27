import React, { lazy, Suspense, useContext, useEffect, useState } from "react"

import GenerateIcon from "src/assets/icons/GenerateWithBg.svg"
import RestoreIcon from "src/assets/icons/RestoreWithBg.svg"
import { DerivedAddressWrapper } from "src/components/DerivedAddrWrapper/DerivedAddrWrapper"
import { RestoreContext } from "src/context/restoreContext"
import { restoreMnemonic } from "src/helpers"

import { Tab } from "./components/Tab"
import classes from "./HomePage.module.scss"
const GenerateContent = lazy(() => import("./components/GenerateContent"))
const RestoreContent = lazy(() => import("./components/RestoreContent"))

const HomePage: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<"generate" | "restore">("generate")

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
          active={activeTabId === 'generate'}
          onClick={() => setActiveTabId('generate')}
        />
        <Tab
          title="Restore"
          desc="Combine enough shares to retrieve your Master Seed"
          icon={RestoreIcon}
          active={activeTabId === 'restore'}
          onClick={() => setActiveTabId('restore')}
        />
      </div>
      <div className={classes.tabContent}>
        {activeTabId === 'generate' ?
          <Suspense><GenerateContent /></Suspense> :
          <Suspense><RestoreContent /></Suspense>}
      </div>
      <DerivedAddressWrapper homeScreenTab={activeTabId} />
    </>
  )
}

export default HomePage
