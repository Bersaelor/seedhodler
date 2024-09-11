import React, { useEffect, useState } from "react"

import { Detector } from "react-detect-offline"
import { HelpModal } from "src/components/HelpModal"
import { Notification } from "src/components/Notification"
import { GenerateContextProvider } from "src/context/generateContext"
import { RestoreContextProvider } from "src/context/restoreContext"
import Routes from "src/Routes"

const App: React.FC = () => {
  const [isNotification, setIsNotification] = useState(false)
  const [isHelpModalActive, setIsHelpModalActive] = useState(false)
  const [isNavFeaturedCardOpen, setIsNavFeaturedCardOpen] = useState(true)
  const [helpModalStartTab, setHelpModalStartTab] = useState<number | null>(null)

  useEffect(() => {
    const handlePrintScreenClick = (e: KeyboardEvent) => {
      if (e.code === "PrintScreen") setIsNotification(true)
    }

    window.addEventListener("keyup", handlePrintScreenClick)

    return () => window.removeEventListener("keyup", handlePrintScreenClick)
  }, [])

  return (
    <GenerateContextProvider>
      <RestoreContextProvider>
        <>
          <HelpModal
            isActive={isHelpModalActive}
            setIsActive={setIsHelpModalActive}
            startTab={helpModalStartTab}
          />
          <Notification isActive={isNotification} setIsActive={setIsNotification} />
          <Detector
            render={({ online }) => (
              <Routes
                isOnline={online}
                setIsHelpModalActive={setIsHelpModalActive}
                setHelpModalStartTab={setHelpModalStartTab}
                isActive={isNavFeaturedCardOpen}
                setIsActive={setIsNavFeaturedCardOpen}
              />
            )}
          />
        </>
      </RestoreContextProvider>
    </GenerateContextProvider>
  )
}

export default App
