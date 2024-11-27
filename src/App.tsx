import React, { useEffect, useState } from "react"

import { Detector } from "react-detect-offline"
import { HelpModal } from "src/components/HelpModal"
import { Notification } from "src/components/Notification"
import { GenerateContextProvider } from "src/context/generateContext"
import { HelpModalContextProvider } from "src/context/HelpModalContext"
import { RestoreContextProvider } from "src/context/restoreContext"
import Routes from "src/Routes"

const App: React.FC = () => {
  const [isNotification, setIsNotification] = useState(false)
  const [showWarningCard, setShowWarningCard] = useState(true)


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
        <HelpModalContextProvider>
          <>
            <HelpModal />
            <Notification isActive={isNotification} setIsActive={setIsNotification} />
            <Detector
              render={({ online }) => (
                <Routes
                  isOnline={online}
                  showWarning={showWarningCard}
                  setShowWarning={setShowWarningCard}
                />
              )}
            />
          </>
        </HelpModalContextProvider>
      </RestoreContextProvider>
    </GenerateContextProvider>
  )
}

export default App
