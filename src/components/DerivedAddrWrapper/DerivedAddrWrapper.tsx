import React, { useContext } from "react";

import { DerivedAddressContent } from "src/components/DerivedAddressContent/DerivedAddressContent";
import { DerivedAddrContextProvider } from "src/context/DerivedAddrContext";
import { GenerateContext } from "src/context/generateContext";
import { RestoreContext } from "src/context/restoreContext";


export const DerivedAddressWrapper: React.FC = () => {

  const { mnemonic24 } = useContext(GenerateContext)
  const { isFullMnemonic } = useContext(RestoreContext)

  return (<DerivedAddrContextProvider bip39Seed="">
    <DerivedAddressContent />
  </DerivedAddrContextProvider>)
}
