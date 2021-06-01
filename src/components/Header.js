import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Row, Button, Nav, Image } from "react-bootstrap"

import { Web3Context } from "../web3"

export default function Header() {
  const { connectWeb3, account, logout } = useContext(Web3Context)

  return (
    <header>
      <div>
        <Image style={{ maxHeight: "60px" }} id="logo-image" src="xil.png" alt="eth-logo" />
        <Nav activeKey="/home">
          {account && (
            <>
              <Nav.Item className="mr-4">
                <Link to="/home">Home</Link>
              </Nav.Item>
              <Nav.Item className="mr-4">
                <Link to="/batch" eventkey="dashboard">
                  Batch Transfer
                </Link>
              </Nav.Item>
            </>
          )}
        </Nav>
      </div>
      <div>
        {account ? (
          <>
            <div sm="8" className="align-self-center">
              <h5 className="text-right">
                Connected:{" "}
                <a
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noreferrer"
                  className="account-link"
                >
                  {account.substring(0, 4) + "..." + account.substring(38, 42)}
                </a>
              </h5>
            </div>

            <div>
              <button onClick={logout}>Disconnect Wallet</button>
            </div>
          </>
        ) : (
          <button onClick={connectWeb3}>Connect Wallet</button>
        )}
      </div>
    </header>
  )
}
