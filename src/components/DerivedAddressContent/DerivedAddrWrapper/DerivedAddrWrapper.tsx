import React, { useContext } from "react";

import { DerivedAddrContextProvider } from "src/context/DerivedAddrContext";
import { GenerateContext } from "src/context/generateContext";
import { DerivedAddressContent } from "../DerivedAddressContent";



export const DerivedAddressWrapper: React.FC = () => {

  const { mnemonic24 } = useContext(GenerateContext)

  return (<DerivedAddrContextProvider bip39Seed="">
    <DerivedAddressContent />
  </DerivedAddrContextProvider>)
}
