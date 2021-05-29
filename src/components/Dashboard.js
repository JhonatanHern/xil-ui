import React, { useState, useContext, useEffect } from "react"
import { Web3Context } from "../web3"
import DragAndDrop from "./DragAndDrop"

export default function Dashboard() {
  const {
    getBalances,
    contracts: { token },
  } = useContext(Web3Context)

  const [balances, setBalances] = useState({})

  useEffect(() => {
    if (token) {
      getBalances().then((b) => setBalances(b))
    } else setBalances({})
  }, [token])

  return (
    <div className="app-container">
      <DragAndDrop handleDrop={() => {}}>Drop</DragAndDrop>
    </div>
  )
}
