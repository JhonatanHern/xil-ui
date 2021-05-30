import React, { useState, useContext, useEffect } from "react"
import { Web3Context } from "../web3"
import DragAndDrop from "./DragAndDrop"

export default function Dashboard() {
  const {
    getBalances,
    contracts: { token },
  } = useContext(Web3Context)

  const [balances, setBalances] = useState({})
  const [fileUploaded, setUploadedFile] = useState(null)

  useEffect(() => {
    if (token) {
      getBalances().then((b) => setBalances(b))
    } else setBalances({})
  }, [token])
  const handleCVS = (data) => {
    data = data.split("\n")
    data.shift()
    data = data
      .map((row) => row.split(",").map((data) => data.trim()))
      .filter((row) => row.length === 2)
    setUploadedFile(data)
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
  return (
    <div className="app-container batch-components">
      {fileUploaded ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {fileUploaded.map((row, i) => (
                <tr>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button>Make Batch Transfer</button>
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
