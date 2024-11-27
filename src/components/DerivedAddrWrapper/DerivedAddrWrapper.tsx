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

    const { isValidMnemonic } = useContext(GenerateContext)
    const { isFullMnemonic } = useContext(RestoreContext)

    const showDerivedAddresses = useMemo(() => {
      console.log("homeScreenTab", homeScreenTab)
      console.log("isValidMnemonic", isValidMnemonic)
      console.log("isFullMnemonic", isFullMnemonic)
      return homeScreenTab === "generate" ? isValidMnemonic : isFullMnemonic
    }, [homeScreenTab, isValidMnemonic, isFullMnemonic])

    if (!showDerivedAddresses) return null

    return (<DerivedAddrContextProvider bip39Seed="">
      <div className={classes.container}>
        <p className={classes.title}>Derived Addresses</p>
        <DerivedAddressContent />
      </div>
    </DerivedAddrContextProvider>)
  }
