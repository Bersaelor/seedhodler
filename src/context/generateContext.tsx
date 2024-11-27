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
  setSelectedWordCount: Dispatch<SetStateAction<"12" | "24">> | (() => void)
  mnemonic: string[]
  setMnemonic: Dispatch<SetStateAction<string[]>> | (() => void)
  isAdvanced: boolean
  setIsAdvanced: Dispatch<SetStateAction<boolean>> | (() => void)
  entropyValue: string
  setEntropyValue: Dispatch<SetStateAction<string>> | (() => void)
  shares: null | string[]
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
  hasEmptyWord: boolean
  isValidMnemonic: boolean
}

export const GenerateContext = createContext<Context>({
  selectedLang: "english",
  setSelectedLang: () => { },
  selectedWordCount: "12",
  setSelectedWordCount: () => { },
  mnemonic: [""],
  setMnemonic: () => { },
  isAdvanced: false,
  setIsAdvanced: () => { },
  entropyValue: "",
  setEntropyValue: () => { },
  shares: null,
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
  hasEmptyWord: true,
  isValidMnemonic: true,
})

type ProviderProps = {
  children: JSX.Element
}

export const GenerateContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState(langOptions[0].value)
  const [selectedWordCount, setSelectedWordCount] = useState<"12" | "24">(wordCountOptions[0].value)
  const [mnemonic12, setMnemonic12] = useState(new Array(12).fill(""))
  const [mnemonic24, setMnemonic24] = useState(new Array(24).fill(""))
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [entropyValue, setEntropyValue] = useState("")
  const [shares12, setShares12] = useState<null | string[]>(null)
  const [shares24, setShares24] = useState<null | string[]>(null)
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const [entropyTypeId, setEntropyTypeId] = useState(0)
  const is12words = useMemo(() => selectedWordCount === "12", [selectedWordCount])
  const minBits = useMemo<128 | 256>(() => is12words ? 128 : 256, [is12words])
  const [thresholdNumber, setThresholdNumber] = useState(3)
  const [sharesNumber, setSharesNumber] = useState(5)

  const entropyToPass = useMemo(() => {
    const { selectedEntropyAsBinary } = getEntropyDetails(entropyValue, minBits, entropyTypeId)
    return selectedEntropyAsBinary.slice(-minBits)
  }, [entropyValue, minBits, entropyTypeId])

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

  const mnemonic = useMemo(() => (is12words ? mnemonic12 : mnemonic24), [is12words, mnemonic12, mnemonic24])
  const setMnemonic = is12words ? setMnemonic12 : setMnemonic24
  const hasEmptyWord = useMemo(() => mnemonic.some(word => word.length === 0), [mnemonic])

  const handleGenerateShares = () => {
    setActiveShareItemId(0)

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

  // set the mnemonic from the entropy
  useEffect(() => {
    if (entropyToPass.length >= minBits) {
      const mnemonic = generateMnemonicFromEntropy(selectedLang, entropyToPass)
      const mnemonicArr = mnemonic.split(" ")
      if (is12words) {
        setMnemonic12(mnemonicArr)
      } else {
        setMnemonic24(mnemonicArr)
      }
    }
  }, [entropyToPass, minBits, selectedLang, is12words])

  // reset the mnemonic if the language changes
  useEffect(() => {
    setMnemonic12(new Array(12).fill(""))
    setMnemonic24(new Array(24).fill(""))
  }, [selectedLang])

  const isValidMnemonic = useMemo(() => validateMnemonic(mnemonic.join(" ")), [hasEmptyWord, mnemonic])

  const shares = useMemo(() => (is12words ? shares12 : shares24), [is12words, shares12, shares24])

  // if the mnenoic is valid generate the shares
  // or if the threshold or shares number changes
  useEffect(() => {
    if (shares && isValidMnemonic) {
      handleGenerateShares()
    }
  }, [thresholdNumber, sharesNumber, isValidMnemonic])

  const contextValue = {
    selectedLang,
    setSelectedLang,
    selectedWordCount,
    setSelectedWordCount,
    mnemonic,
    setMnemonic,
    isAdvanced,
    setIsAdvanced,
    entropyValue,
    setEntropyValue,
    shares,
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
    hasEmptyWord,
    isValidMnemonic,
  }

  return <GenerateContext.Provider value={contextValue}>{children}</GenerateContext.Provider>
}
