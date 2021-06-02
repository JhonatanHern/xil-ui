import React, { useState, useContext, useEffect } from "react"
import ReactJsAlert from "reactjs-alert"
import Web3 from "web3"
import DragAndDrop from "./DragAndDrop"
import { Web3Context } from "../web3"

const BN = Web3.utils.BN
const toWei = Web3.utils.toWei

const validCharactersForAmount = "0123456789".split("")

const isValidAmount = (amount) => {
  for (const character of amount.split("")) {
    if (!validCharactersForAmount.includes(character)) {
      return false
    }
  }
  return true
}

const err = (msg) => {
  return { error: msg }
}

export default function Dashboard() {
  const {
    getBalances,
    contracts: { token },
    batchTransfer,
  } = useContext(Web3Context)

  const [balances, setBalances] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [transferState, setTransferState] = useState("uninitialized")

  const loadBalance = async () => {
    console.log("getting data")
    if (token) {
      setBalances(await getBalances())
    } else {
      setBalances({})
    }
  }
  useEffect(loadBalance, [loading, uploadedFile, token])
  useEffect(loadBalance, [])
  const isRowValid = (row) => {
    const address = row[0]
    const amount = row[1]
    if (!Web3.utils.isAddress(address)) {
      return err(`"${address}" is not an address. Insert a proper address`)
    }
    if (!amount || !isValidAmount(amount)) {
      return err("Insert a proper amount to transfer")
    }
    let bnAmount
    try {
      bnAmount = new BN(amount)
    } catch (error) {
      return err("Insert a proper amount greater than zero")
    }
    if (new BN("0").gte(bnAmount)) {
      // 0 >= amount ?
      return err("Insert an amount greater than zero")
    }
    return { success: true }
  }
  const validateTotalAmount = (data) => {
    let sumOfAllAmounts = new BN("0")
    for (const row of data) {
      sumOfAllAmounts = sumOfAllAmounts.add(new BN(row[1]))
    }
    return sumOfAllAmounts.lte(balances.rawXIL)
  }
  const handleCVS = (data) => {
    try {
      data = data.split("\n")
      data.shift() //remove first element of the csv
      data = data
        .map((row) => row.split(",").map((data) => data.trim()))
        .filter((row) => row.length === 2)
    } catch (e) {
      alert("your file isn't correctly formatted")
      return
    }
    for (let i = 0; i < data.length; i++) {
      let testResult = isRowValid(data[i])
      if (!testResult.success) {
        alert(testResult.error + " at line " + (i + 1))
        return
      }
    }
    if (validateTotalAmount(data)) {
      setUploadedFile(data)
    } else {
      alert("you don't have enough funds to execute this transaction")
    }
  }
  const handleUpload = (fileArray) => {
    const file = fileArray[0]
    if (file.name.substr(file.name.length - 4, file.name.length) === ".csv") {
      const reader = new FileReader()
      reader.onload = () => {
        handleCVS(reader.result)
      }
      reader.readAsText(file)
    } else {
      alert("Invalid type of file")
    }
  }
  const rowToTransferData = (row) => {
    return {
      recipient: row[0],
      amount: row[1],
    }
  }
  const makeBatch = async () => {
    // struct TransferData{
    //   address recipient;
    //   uint amount;
    // }
    const data = uploadedFile.map(rowToTransferData)
    setLoading(true)
    let result = await batchTransfer(data)
    setTransferState(result)
    if (result === "success") {
      setUploadedFile(null)
    }
    setLoading(false)
  }
  return (
    <div className="app-container batch-components">
      {transferState === "success" && (
        <ReactJsAlert
          status={true} // true or false
          type="success" // success, warning, error, info
          title="Your transaction has succeded." // title you want to display
          Close={() => {}} // callback method for hide
        />
      )}
      {transferState === "error" && (
        <ReactJsAlert
          status={true} // true or false
          type="error" // success, warning, error, info
          title="Your transaction has failed. Check that you have enough gas and the status of your connection." // title you want to display
          Close={() => {
            window.location.reload()
          }} // callback method for hide
        />
      )}
      {uploadedFile ? (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFile.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td>{Web3.utils.fromWei(row[1])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {loading ? (
              <button>Loading...</button>
            ) : (
              <button onClick={makeBatch}>Make Batch Transfer</button>
            )}
          </div>
        </>
      ) : (
        <DragAndDrop handleDrop={handleUpload}>
          <img src="upload.svg" />
          <h2>Drop CVS file here</h2>
        </DragAndDrop>
      )}
    </div>
  )
}
