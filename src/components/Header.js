import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { Image } from "react-bootstrap"

import { Web3Context } from "../web3"

export default function Header() {
  const { connectWeb3, account, logout } = useContext(Web3Context)
  const [activeMenu, setActiveMenu] = useState(false)

  const navItems = (
    <>
      <div>
        <Link to="/home" onClick={() => setActiveMenu(false)}>
          Home
        </Link>
      </div>{" "}
      <div className="mr-4">
        <Link to="/batch" onClick={() => setActiveMenu(false)}>
          Batch Transfer
        </Link>
      </div>
    </>
  )

  return (
    <header>
      <div>
        <Image
          onClick={() => setActiveMenu(!activeMenu)}
          style={{ marginLeft: "1em", marginRight: "1em" }}
          id="logo-image"
          src="xil.svg"
          alt="eth-logo"
        />
        {account && <div className="desktop desktop-links">{navItems}</div>}
      </div>
      <div>
        {account ? (
          <>
            <div sm="8" className="align-self-center desktop">
              <h5 className="text-right">
                Connected:{" "}
                <a
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noreferrer"
                  className="account-link"
                >
                  {account && account.substring(0, 5) + "..." + account.substring(39, 42)}
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
      <section className={"mobile floating-menu" + (activeMenu ? " active" : "")}>
        {navItems}
        <div>
          Connected:{" "}
          <a
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noreferrer"
            className="account-link"
          >
            {account && account.substring(0, 5) + "..." + account.substring(39, 42)}
          </a>
        </div>
      </section>
    </header>
  )
}
