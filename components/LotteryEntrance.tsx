import React, { ReactElement } from "react"
import { useWeb3Contract } from "react-moralis"

interface LotteryEntranceProps {}

export const LotteryEntrance = ({}: LotteryEntranceProps): ReactElement => {
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    // abi: "",
    // contractAddress: "",
    // functionName: "",
    // params: {},
    // msgValue: "",
  })

  return <div></div>
}
