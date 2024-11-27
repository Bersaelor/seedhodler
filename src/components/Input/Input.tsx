import CSS from "csstype"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"


import classes from "./Input.module.scss"

type Props = {
  totalWords: number
  wordNr?: number
  index: number
  value: string
  onChange: Dispatch<SetStateAction<string[]>>
  onClick?: (index: number) => void
  onEnter: (index: number) => void
  wordlist: string[]
  isError?: boolean
  className?: string
  containerStyle?: CSS.Properties
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      totalWords, wordNr, index, value, onChange, onClick, onEnter,
      wordlist, isError, className, containerStyle
    },
    ref,
  ) => {

    const classNamesArr = [classes.input, className]
    if (isError) {
      classNamesArr.push(classes.error)
    }
    const classNames = classNamesArr.join(" ")
    const [focusedItemId, setFocusedItemId] = useState(0)
    const variants: string[] = []
    const isOpen = value.length !== 0 && !wordlist.some(word => word === value)
    let variantsCounter = 0

    for (let i = 0; i < wordlist.length; i++) {
      if (variantsCounter < 5) {
        if (wordlist[i].startsWith(value.toLowerCase())) {
          variantsCounter++
          variants.push(wordlist[i])
        }
      } else {
        break
      }
    }

    const handleChange = (newValue: string) => {
      // if the user enters a whole list of words, like when copy-pasting,
      // fill out the whole list
      if (newValue.split(" ").length === totalWords) {
        onChange(newValue.split(" "))
        return
      }
      onChange(mnemonicArr =>
        mnemonicArr.map((word, wordIndex) => (wordIndex === index ? newValue : word)),
      )
    }

    useEffect(() => {
      const onKeydown = (e: KeyboardEvent) => {
        if (isOpen) {
          if (e.key === "Tab" || e.key === "ArrowDown") {
            e.preventDefault()
            setFocusedItemId(prev => (focusedItemId < variants.length - 1 ? prev + 1 : 0))
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setFocusedItemId(prev => (focusedItemId <= 0 ? variants.length - 1 : prev - 1))
          } else if (e.key === "Enter" && variants.length > 0) {
            e.preventDefault()
            onChange(mnemonicArr =>
              mnemonicArr.map((word, wordIndex) =>
                wordIndex === index ? variants[focusedItemId] : word,
              ),
            )
            onEnter(index)
          }
        } else if (e.key === "Enter" && wordlist.some(word => word === value)) {
          onEnter(index)
        }
      }

      document.addEventListener("keydown", onKeydown)

      return () => document.removeEventListener("keydown", onKeydown)
    }, [focusedItemId, variants, isOpen, variants, index])

    useEffect(() => {
      setFocusedItemId(0)
    }, [value])

    return (
      <div
        onClick={() => (onClick ? onClick(index) : null)}
        className={classes.container}
        style={containerStyle}
      >
        {wordNr && <span className={classes.count}>{wordNr}.</span>}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          className={classNames}
        />
        {isOpen && (
          <div className={classes.dropdownList}>
            {variants.length === 0 ? (
              <div className={classes.incorrectText}>Incorrect word</div>
            ) : (
              variants.map((variant, i) => (
                <button
                  onClick={() => handleChange(variant)}
                  key={variant}
                  className={`${classes.dropdownListItem} ${i === focusedItemId ? classes.focused : ""}`}
                  tabIndex={0}
                >
                  {variant}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    )
  },
)

export default Input
