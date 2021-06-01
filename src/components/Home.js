import React, { useContext, useState, useEffect } from "react"
import Web3 from "web3"

import { Web3Context } from "../web3"

const BN = Web3.utils.BN

const statuses = {
  DEFAULT: "default",
  TRANSACT: "transact",
}

const validCharactersForAmount = "0123456789.".split("")

const isValidAmount = (amount) => {
  for (const character of amount.split("")) {
    if (!validCharactersForAmount.includes(character)) {
      return false
    }
  }
  return true
}

export default function Home() {
  const {
    getBalances,
    account,
    contracts: { token },
    toWei,
    performTransaction,
  } = useContext(Web3Context)
  const [status, setStatus] = useState(statuses.DEFAULT)
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const [balances, setBalances] = useState({})

  useEffect(async () => {
    if (token) {
      setBalances(await getBalances())
    } else {
      setBalances({})
    }
  })

  const sendTransaction = async () => {
    // validate amount
    if (!amount || !isValidAmount(amount)) {
      alert("insert a proper amount")
      return
    }
    let bnAmount
    try {
      bnAmount = new BN(toWei(amount))
    } catch (error) {
      alert("Insert a proper amount")
      return
    }
    // validate address
    if (!Web3.utils.isAddress(address)) {
      alert("Provide a correct address")
      return
    }
    // validate that the user has enough tokens to perform this transaction
    const balance = balances.rawXIL
    if (balance.lt(bnAmount)) {
      alert("you do not have enough tokens to perform this operation")
    }
    setLoading(true)
    await performTransaction(address, toWei(amount))
    setLoading(false)
  }
  if (!account) {
    return (
      <div className="home">
        <h2>Connect your wallet</h2>
      </div>
    )
  }
  console.log(balances)
  return (
    <div className="home">
      <h2>{balances && (typeof balances.XIL === "number" ? balances.XIL : "Loading...")} XIL</h2>
      {status === statuses.DEFAULT && (
        <button onClick={() => setStatus(statuses.TRANSACT)}>Send</button>
      )}
      {status === statuses.TRANSACT && (
        <div>
          <div>
            Address: <input onKeyUp={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            Amount: <input onKeyUp={(e) => setAmount(e.target.value)} />
          </div>
          {loading ? <button>Loading...</button> : <button onClick={sendTransaction}>Send</button>}
        </div>
      )}
    </div>
  )
}
