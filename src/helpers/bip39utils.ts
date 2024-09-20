import * as bip39 from "bip39"
import { binaryStrToEntropyArray } from "./entropyUtils"

export const generateMnemonic = (language: string, wordCount: number) => {
  bip39.setDefaultWordlist(language)

  const strength = Math.ceil((wordCount * 32) / 3)
  return bip39.generateMnemonic(strength)
}

export const generateMnemonicFromEntropy = (language: string, binaryStr: string) => {
  bip39.setDefaultWordlist(language)

  const entropyArr = binaryStrToEntropyArray(binaryStr)
  //@ts-ignore
  return bip39.entropyToMnemonic(entropyArr)
}

export const mnemonicToEntropy = (language: string, mnemonic: string) => {
  const wordList = bip39.wordlists[language]
  // console.log(`language: ${language}, mnemonic: ${mnemonic}, wordList: ${wordList}`)
  return bip39.mnemonicToEntropy(mnemonic, wordList)
}

export const mnemonicToSeed = (mnemonic: string) => {
  return bip39.mnemonicToSeedSync(mnemonic)
}

export const entropyToMnemonic = (language: string, entropy: Buffer) => {
  const wordList = bip39.wordlists[language]
  return bip39.entropyToMnemonic(entropy, wordList)
}

export const validateMnemonic = (language: string, mnemonic: string) => {
  const wordList = bip39.wordlists[language]
  return bip39.validateMnemonic(mnemonic, wordList)
}
