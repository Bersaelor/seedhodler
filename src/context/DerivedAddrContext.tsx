import React, { createContext, Dispatch, SetStateAction } from "react";

type DerivedAddrType = {
  customDerivationPath: string | null,
  setCurrentCustomDerivationPath: Dispatch<SetStateAction<string | null>>,
}

export const DerivedAddrContext = createContext<DerivedAddrType>({
  customDerivationPath: null,
  setCurrentCustomDerivationPath: () => { },
});

export const DerivedAddrContextProvider: React.FC<{
  children: JSX.Element,
  bip39Seed: string[]
}> = ({
  children,
  bip39Seed,
}) => {
    const [customDerivationPath, setCurrentCustomDerivationPath] = React.useState<string | null>(null);

    return (
      <DerivedAddrContext.Provider value={{ customDerivationPath, setCurrentCustomDerivationPath }}>
        {children}
      </DerivedAddrContext.Provider>
    )
  }

