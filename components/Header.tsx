import React, { ReactElement } from "react"
import { ConnectButton } from "web3uikit"

interface HeaderProps {}

export const Header = ({}: HeaderProps): ReactElement => {
  return (
    <div>
      <h1>Decentralised Lottery</h1>

      <ConnectButton moralisAuth={false} />
    </div>
  )
}
