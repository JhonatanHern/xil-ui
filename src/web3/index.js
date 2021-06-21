import React, { useReducer, useEffect, useCallback, createContext } from "react"

import { Web3Reducer } from "./reducer"

// WEB3 CONNECTION PACKAGES
import Web3 from "web3"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"
import Torus from "@toruslabs/torus-embed"
import Authereum from "authereum"

import { BEP20_WITH_BATCH_ABI, addressesByNetwork } from "./constants"

import notify from "../utils/notify"

import history from "../history"

let web3

const initialState = {
  loading: true,
  account: null,
  networkId: null,
  contracts: {
    token: null,
  },
}

export const Web3Context = createContext(initialState)

export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Web3Reducer, initialState)

  const { account, contracts } = state

  // STATE MANAGEMENT
  const setAccount = (account) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: account,
    })
  }

  const setContracts = (contracts) => {
    dispatch({
      type: "SET_CONTRACTS",
      payload: contracts,
    })
  }

  const setNetworkId = (networkId) => {
    dispatch({
      type: "SET_NETWORK_ID",
      payload: networkId,
    })
  }

  const setProtocol = async (accounts) => {
    setAccount(accounts[0])
    console.log("net:", state.networkId)
    // Contract Instances
    const networkId = await web3.givenProvider.networkVersion
    setNetworkId(networkId)
    if (addressesByNetwork[Number(networkId)]) {
      window.token = new web3.eth.Contract(
        BEP20_WITH_BATCH_ABI,
        addressesByNetwork[Number(networkId)],
        {
          from: accounts[0],
        }
      )
      setContracts({
        token: window.token,
      })
    } else {
      alert(
        "Please connect to etherum mainnet network or to the Binance smart chain. The app won't work otherwise."
      )
    }
  }

  // === HELPERS === //
  const logout = () => {
    dispatch({
      type: "CLEAR_STATE",
      payload: initialState,
    })
    localStorage.setItem("WEB3_CONNECT_CACHED_PROVIDER", null)
    history.push("/")
  }
  const toWei = (value) => web3.utils.toWei(String(value))
  const fromWei = (value) => Number(web3.utils.fromWei(String(value)))
  const toBN = (value) => new web3.utils.BN(String(value))

  // === MAIN FUNCTIONS === //

  // Connect Web3 wallet and set state (contracts, roles, account)
  const connectWeb3 = useCallback(async () => {
    // Web3 Modal
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "36bbdc3ed5bd449fad0374a2e07b850a", // required
        },
      },
      torus: {
        package: Torus, // required
        options: {
          networkParams: {
            host: "https://mainnet.infura.io/v3/36bbdc3ed5bd449fad0374a2e07b850a", // optional
            networkId: 1, // optional
          },
          config: {
            buildEnv: "production", // optional
          },
        },
      },
      authereum: {
        package: Authereum,
      },
    }

    try {
      const web3Modal = new Web3Modal({
        // network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
        theme: "light",
      })

      const provider = await web3Modal.connect()

      web3 = new Web3(provider)
      window.web3 = web3

      const _accounts = await web3.eth.getAccounts()
      await setProtocol(_accounts)
      console.log("Connected Account: ", _accounts[0])

      notify("success", "connected web3 wallet", 1500)

      window.ethereum.on("chainChanged", () => {
        document.location.reload()
      })

      //If accounts change
      window.ethereum.on("accountsChanged", (accounts) => {
        document.location.reload()
      })
    } catch (error) {
      notify("error", "Could not connect to web3!")
      console.log(error.message)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getBalances = async () => {
    try {
      const balanceXIL = await contracts.token.methods.balanceOf(account).call()

      return { rawXIL: new Web3.utils.BN(balanceXIL), XIL: fromWei(balanceXIL) }
    } catch (error) {
      notify("error", error.message)
      console.log(error.message)
    }
  }

  const performTransaction = async (recipient, amount) => {
    try {
      await contracts.token.methods.transfer(recipient, amount).send({ from: account.address })
      return
    } catch (error) {
      alert(
        "Something has ocurred with your transaction, check that you have enough gas to execute it."
      )
      return error
    }
  }
  const batchTransfer = async (data) => {
    try {
      let res = await contracts.token.methods.batchTransfer(data).send({ from: account.address })
      console.log(res)
      return "success"
    } catch (error) {
      console.log(error)
      return "error"
    }
  }

  // Connect web3 on app load
  useEffect(() => {
    connectWeb3()
  }, [connectWeb3])

  return (
    <Web3Context.Provider
      value={{
        ...state,
        connectWeb3,
        logout,
        toWei,
        fromWei,
        toBN,
        getBalances,
        performTransaction,
        batchTransfer,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
