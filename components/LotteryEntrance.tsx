import React, { ReactElement, useCallback, useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import abi from "../constants/abi.json"
import contractAddresses from "../constants/contractAddresses.json"
import { useNotification } from "web3uikit"

interface LotteryEntranceProps {}

export const LotteryEntrance = ({}: LotteryEntranceProps): ReactElement => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = chainIdHex ? parseInt(chainIdHex) : 0
  const raffleAddress = chainIdHex
    ? (contractAddresses as Record<string, string[]>)[chainId][0]
    : ""
  const [entranceFee, setEntranceFee] = useState("0")
  const [numberOfPlayers, setNumberOfPlayers] = useState(0)
  const [recentWinner, setRecentWinner] = useState("")
  const notify = useNotification()

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  })

  const getRaffleData = useCallback(async () => {
    const _entranceFee = ((await getEntranceFee()) as number).toString()
    const _numberOfPlayers = parseInt(((await getNumberOfPlayers()) as number).toString())
    const _recentWiner = (await getRecentWinner()) as string

    setEntranceFee(_entranceFee || "")
    setNumberOfPlayers(_numberOfPlayers || 0)
    setRecentWinner(_recentWiner || "")
  }, [getEntranceFee, getNumberOfPlayers, getRecentWinner])

  useEffect(() => {
    if (isWeb3Enabled) {
      getRaffleData()
    }
  }, [isWeb3Enabled, getRaffleData])

  const onEnterRaffleClick = useCallback(async () => {
    await enterRaffle({
      onSuccess: async (tx: any) => {
        // wait for the transaction to be mined
        await tx.wait(1)

        // notify the user
        notify({
          type: "info",
          message: "Transaction Complete!",
          title: "Transaction Notification",
          position: "topR",
          icon: "bell",
        })

        // refresh the new raffle data
        await getRaffleData()
      },
      onError: console.error,
    })
  }, [enterRaffle, notify, getRaffleData])

  if (!chainIdHex) {
    return <div>Please connect to a network to enter into the lottery!</div>
  }

  if (!raffleAddress) {
    return <div>No Raffle Address detected!</div>
  }

  return (
    <div>
      <button onClick={onEnterRaffleClick}>Enter Raffle</button>

      <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}</div>
      <div>Number of Players: {numberOfPlayers}</div>
      <div>Recent Winner: {recentWinner}</div>
    </div>
  )
}
