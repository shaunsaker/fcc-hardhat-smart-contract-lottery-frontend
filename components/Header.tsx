import React, { ReactElement } from "react"
import { ConnectButton } from "web3uikit"

interface HeaderProps {}

export const Header = ({}: HeaderProps): ReactElement => {
  return (
    <div className="p-5 border-b-2 flex flex-row">
      <h1 className="py-4 px-4 font-blog text-3xl">Decentralised Lottery</h1>

      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  )
}
