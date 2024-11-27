import React, { createContext, Dispatch, SetStateAction, useState } from "react"
import { HelpModalTabs } from "src/constants"

type HelpModalType = {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  tab: number,
  setTab: Dispatch<SetStateAction<number>>,
}

export const HelpModalContext = createContext<HelpModalType>({ isOpen: false, setIsOpen: () => { }, tab: 0, setTab: () => { } })

export const HelpModalContextProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<number>(HelpModalTabs.Introduction)

  return (
    <HelpModalContext.Provider value={{ isOpen, setIsOpen, tab, setTab }}>
      {children}
    </HelpModalContext.Provider>
  )
}