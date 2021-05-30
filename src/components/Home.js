import React, { useContext, useState, useEffect } from "react"

import { Web3Context } from "../web3"

const statuses = {
  DEFAULT: "default",
  TRANSACT: "transact",
}

export default function Home() {
  const {
    getBalances,
    contracts: { token },
  } = useContext(Web3Context)
  const { account } = useContext(Web3Context)
  const [status, setStatus] = useState(statuses.DEFAULT)

  const [balances, setBalances] = useState({})

  useEffect(async () => {
    if (token) {
      setBalances(await getBalances())
    } else {
      setBalances({})
    }
  }, [token])
  console.log(balances)
  return (
    <div className="home">
      My Balance:
      {balances && (typeof balances.XIL === "number" ? balances.XIL : "Loading...")}
      {status === statuses.DEFAULT && <></>}
      {status === statuses.TRANSACT && <></>}
    </div>
  )
}
