import React, { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

import { langOptions, wordCountOptions } from "src/constants/"
import {
  generateMnemonic,
  generateMnemonicFromEntropy,
  getEntropyDetails,
  getFormattedShares,
  hexStringToByteArray,
  mnemonicToEntropy,
  validateMnemonic
} from "src/helpers"

type Context = {
  selectedLang: string
  setSelectedLang: Dispatch<SetStateAction<string>> | (() => void)
  selectedWordCount: string
  setSelectedWordCount: Dispatch<SetStateAction<string>> | (() => void)
  mnemonic12: string[]
  setMnemonic12: Dispatch<SetStateAction<string[]>> | (() => void)
  mnemonic24: string[]
  setMnemonic24: Dispatch<SetStateAction<string[]>> | (() => void)
  isAdvanced: boolean
  setIsAdvanced: Dispatch<SetStateAction<boolean>> | (() => void)
  entropyValue: string
  setEntropyValue: Dispatch<SetStateAction<string>> | (() => void)
  shares12: null | string[]
  setShares12: Dispatch<SetStateAction<null | string[]>> | (() => void)
  shares24: null | string[]
  setShares24: Dispatch<SetStateAction<null | string[]>> | (() => void)
  activeShareItemId: number
  setActiveShareItemId: Dispatch<SetStateAction<number>> | (() => void)
  entropyTypeId: number
  setEntropyTypeId: Dispatch<SetStateAction<number>> | (() => void)
  minBits: 128 | 256
  entropyToPass: string
  thresholdNumber: number
  setThresholdNumber: Dispatch<SetStateAction<number>> | (() => void)
  sharesNumber: number
  setSharesNumber: Dispatch<SetStateAction<number>> | (() => void)
  handleGenerateShares: () => void
  handleGeneratePhase: () => void
  isValidMnemonic: boolean
}

export const GenerateContext = createContext<Context>({
  selectedLang: "english",
  setSelectedLang: () => { },
  selectedWordCount: "12",
  setSelectedWordCount: () => { },
  mnemonic12: [""],
  setMnemonic12: () => { },
  mnemonic24: [""],
  setMnemonic24: () => { },
  isAdvanced: false,
  setIsAdvanced: () => { },
  entropyValue: "",
  setEntropyValue: () => { },
  shares12: null,
  setShares12: () => { },
  shares24: null,
  setShares24: () => { },
  activeShareItemId: 0,
  setActiveShareItemId: () => { },
  entropyTypeId: 0,
  setEntropyTypeId: () => { },
  minBits: 128,
  entropyToPass: "",
  thresholdNumber: 0,
  setThresholdNumber: () => { },
  sharesNumber: 0,
  setSharesNumber: () => { },
  handleGenerateShares: () => { },
  handleGeneratePhase: () => { },
  isValidMnemonic: true,
})

type ProviderProps = {
  children: JSX.Element
}

export const GenerateContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState(langOptions[0].value)
  const [selectedWordCount, setSelectedWordCount] = useState(wordCountOptions[0].value)
  const [mnemonic12, setMnemonic12] = useState(new Array(12).fill(""))
  const [mnemonic24, setMnemonic24] = useState(new Array(24).fill(""))
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [entropyValue, setEntropyValue] = useState("")
  const [shares12, setShares12] = useState<null | string[]>(null)
  const [shares24, setShares24] = useState<null | string[]>(null)
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const [entropyTypeId, setEntropyTypeId] = useState(0)
  const minBits: 128 | 256 = +selectedWordCount === 12 ? 128 : 256
  const [thresholdNumber, setThresholdNumber] = useState(3)
  const [sharesNumber, setSharesNumber] = useState(5)
  const is12words = selectedWordCount === "12"

  const { selectedEntropyAsBinary } = getEntropyDetails(entropyValue, minBits, entropyTypeId)
  const entropyToPass = selectedEntropyAsBinary.slice(-minBits)

  const handleGeneratePhase = () => {
    if (is12words) {
      setShares12(null)
    } else {
      setShares24(null)
    }
    setActiveShareItemId(0)

    let mnemonic
    if (!isAdvanced) {
      mnemonic = generateMnemonic(selectedLang, +selectedWordCount)
    } else {
      mnemonic = generateMnemonicFromEntropy(selectedLang, entropyToPass)
    }
    // some languages use U+0020 (space) and some use U+3000 (ideographic space)
    const blankspaces = [" ", "　"];
    // split the mnemonic by either blankspace
    const mnemonicArr = mnemonic.split(new RegExp(blankspaces.join("|"), "g"))

    if (is12words) {
      setMnemonic12(mnemonicArr)
    } else {
      setMnemonic24(mnemonicArr)
    }
  }

  const handleGenerateShares = () => {
    setActiveShareItemId(0)
    const mnemonic = is12words ? mnemonic12 : mnemonic24

    const mnemonicStr = mnemonic.join(" ")
    const groups = [[thresholdNumber, sharesNumber]]
    const masterSecret = hexStringToByteArray(mnemonicToEntropy(mnemonicStr))

    const shares = getFormattedShares(masterSecret, "", 1, groups)
    if (is12words) {
      setShares12(shares)
    } else {
      setShares24(shares)
    }
  }

  // reset the mnemonic if the language changes
  useEffect(() => {
    setMnemonic12(new Array(12).fill(""))
    setMnemonic24(new Array(24).fill(""))
  }, [selectedLang])

  const isValidMnemonic = useMemo(() => {
    const is12wordsGenerate = selectedWordCount === "12"
    const mnemonic = is12wordsGenerate ? mnemonic12 : mnemonic24
    const hasEmptyWord = mnemonic.some(word => word.length === 0)

    if (hasEmptyWord) {
      return true
    }

    if (!hasEmptyWord && mnemonic[mnemonic.length - 1].length >= 3) {
      return validateMnemonic(mnemonic.join(" "))
    }
  }, [selectedWordCount, mnemonic12, mnemonic24])

  const contextValue = {
    selectedLang,
    setSelectedLang,
    selectedWordCount,
    setSelectedWordCount,
    mnemonic12,
    setMnemonic12,
    mnemonic24,
    setMnemonic24,
    isAdvanced,
    setIsAdvanced,
    entropyValue,
    setEntropyValue,
    shares12,
    setShares12,
    shares24,
    setShares24,
    activeShareItemId,
    setActiveShareItemId,
    entropyTypeId,
    setEntropyTypeId,
    minBits,
    entropyToPass,
    thresholdNumber,
    setThresholdNumber,
    sharesNumber,
    setSharesNumber,
    handleGenerateShares,
    handleGeneratePhase,
    isValidMnemonic,
  }

  return <GenerateContext.Provider value={contextValue}>{children}</GenerateContext.Provider>
}
