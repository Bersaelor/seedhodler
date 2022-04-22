import React, { useState } from "react"

import variables from "styles/Variables.module.scss"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { Button } from "components/Button"
import { Select } from "components/Select"
import { SelectNew } from "components/SelectNew"
import { Input } from "components/Input"
import { Calc } from "components/Calc"

type Props = {}

const HomePage: React.FC<Props> = () => {
  const [inputValue, setInputValue] = useState("Some value")

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "500px",
        height: "400px",
        margin: "auto auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: variables.colorBg100,
      }}
    >
      <Button iconRight={ArrowRightIcon} style={{ marginBottom: "1rem" }}>
        Ok! Got it
      </Button>
      <Select style={{ marginBottom: "1rem" }} />
      {/* <SelectNew /> */}
      <Input
        count={1}
        value={inputValue}
        onChange={setInputValue}
        variants={["final", "fact", "fence", "forest"]}
      />
      <Calc value={2} onPlus={() => {}} onMinus={() => {}} />
    </div>
  )
}

export default HomePage
