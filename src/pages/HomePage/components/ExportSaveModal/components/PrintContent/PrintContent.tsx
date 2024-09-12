import React, { Dispatch, SetStateAction, useState } from "react"

import ArrowRightIcon from "src/assets/icons/ArrowRight.svg"
import LogoIcon from "src/assets/icons/Logo.svg"
import PrintIcon from "src/assets/icons/Print.svg"
import { AdditionalInfo } from "src/components/AdditionalInfo"
import { Button } from "src/components/Button"
import { TextPlace } from "src/components/TextPlace"
import { ButtonColorsEnum } from "src/constants/index"

import { pdf } from "@react-pdf/renderer"
import { PDFTemplate } from "src/components/PDFTemplate"
import classes from "../../ExportSaveModal.module.scss"

import { InputWrapper } from "src/components/InputWrapper"

type Props = {
  selectedWordCount: number
  mnemonic: string[]
  setCurrentStep: Dispatch<SetStateAction<number>>
  sharesNumber: number
}

const PrintContent: React.FC<Props> = ({
  selectedWordCount,
  mnemonic,
  setCurrentStep,
  sharesNumber,
}) => {
  const [isCreatingPdf, setIsCreatingPdf] = useState(false)

  const handlePrint = async () => {
    setIsCreatingPdf(true)
    const blob = await pdf(
      <PDFTemplate selectedWordCount={selectedWordCount} sharesNumber={sharesNumber} />,
    ).toBlob()

    const fileUrl = URL.createObjectURL(blob)
    const docWindow = window.open(fileUrl, "PRINT", "height=720,width=1280")
    docWindow?.focus()
    docWindow?.print()
    setIsCreatingPdf(false)
  }

  return (
    <>
      <p className={classes.description}>
        Before continuing please either print the provided Seedhodler Phraseholder or use pen and paper
        to write down your generated phrases.
      </p>
      <div className={classes.contentContainer}>
        <div className={classes.logoContainer}>
          <div style={{ width: "60px" }} className={classes.whitespace}></div>
          <img src={LogoIcon} alt="Logo" className={classes.logo} />
          <div style={{ width: "60px" }} className={classes.whitespace}></div>
        </div>
        <p className={classes.innerDescription}>
          Use the Seedhodler Phraseholder to write down your generated phrases.
        </p>
        <InputWrapper>
          <>
            <div className={classes.titleBox}>
              <p className={classes.titleInfo}>Seed Phrase</p>
              <AdditionalInfo info="BIP 39" className={classes.additionalInfo} />
            </div>
            <div
              className={classes.textPlacesContainer}
              style={{ height: selectedWordCount === 12 ? "430px" : "860px" }}
            >
              {mnemonic.map((word, index) => (
                <TextPlace
                  key={index}
                  text={word}
                  count={index + 1}
                  className={classes.textPlace}
                  style={{
                    width: "49%",
                    alignSelf: index <= (selectedWordCount === 12 ? 5 : 11) ? "flex-start" : "flex-end",
                  }}
                />
              ))}
            </div>
          </>
        </InputWrapper>
        <p className={classes.innerDescription} style={{ marginBottom: 0 }}>
          etc.
          <br /> In seedhodler we trust.
        </p>
      </div>
      <div className={classes.buttonsContainer}>
        <Button
          onClick={handlePrint}
          isLoading={isCreatingPdf}
          disabled={isCreatingPdf}
          iconRight={PrintIcon}
          color={ButtonColorsEnum.ErrorLightish}
        >
          {!isCreatingPdf ? "Print" : "Printing..."}
        </Button>
        <Button onClick={() => setCurrentStep(prev => ++prev)} iconRight={ArrowRightIcon}>
          Continue
        </Button>
      </div>
    </>
  )
}

export default PrintContent
