import React, { useContext, useMemo } from "react";

import { DerivedAddressContent } from "src/components/DerivedAddressContent/DerivedAddressContent";
import { DerivedAddrContextProvider } from "src/context/DerivedAddrContext";
import { GenerateContext } from "src/context/generateContext";
import { RestoreContext } from "src/context/restoreContext";

import classes from "./DerivedAddressWrapper.module.scss";

export const DerivedAddressWrapper: React.FC<{
  homeScreenTab: "generate" | "restore"
}> = ({
  homeScreenTab
}) => {

    const { isValidMnemonic, mnemonic: generateMnemonic } = useContext(GenerateContext)
    const { isFullMnemonic, restoredMnemonic } = useContext(RestoreContext)

    const showDerivedAddresses = useMemo(
      () => homeScreenTab === "generate" ? isValidMnemonic : isFullMnemonic,
      [homeScreenTab, isValidMnemonic, isFullMnemonic]
    )

    if (!showDerivedAddresses) return null

    return (
      <div className={classes.container}>
        <p className={classes.title}>Derived Addresses</p>
        <DerivedAddrContextProvider bip39Seed={homeScreenTab === "generate" ? generateMnemonic : restoredMnemonic}>
          <DerivedAddressContent />
        </DerivedAddrContextProvider>
      </div>
    )
  }
