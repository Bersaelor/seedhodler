import React, { Dispatch, lazy, SetStateAction, Suspense } from "react"
import { Navigate, Route, Routes as RouterDomRoutes } from "react-router-dom"

import { Layout } from "src/components/Layout"
import { HomePage } from "src/pages/HomePage"
const PrintPage = lazy(() => import("src/pages/PrintPage"))

type Props = {
  isOnline: boolean
  setIsHelpModalActive: Dispatch<SetStateAction<boolean>>
  setHelpModalStartTab: Dispatch<SetStateAction<number | null>>
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
}

const Routes: React.FC<Props> = ({
  isOnline,
  setIsHelpModalActive,
  isActive,
  setIsActive,
  setHelpModalStartTab,
}) => {
  return (
    <RouterDomRoutes>
      <Route
        path="/"
        element={
          <Layout
            isOnline={isOnline}
            setIsHelpModalActive={setIsHelpModalActive}
            isActive={isActive}
            setIsActive={setIsActive}
            setHelpModalStartTab={setHelpModalStartTab}
          />
        }
      >
        <Route index element={<HomePage />} />
        <Route path="print" element={<Suspense><PrintPage /></Suspense>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </RouterDomRoutes>
  )
}

export default Routes
