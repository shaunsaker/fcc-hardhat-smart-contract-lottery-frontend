import React, { ReactElement, useCallback, useEffect } from "react"
import { useMoralis } from "react-moralis"
import { formatAddress } from "../utils/formatAddress"

enum LocalStorage {
  connected = "connected",
}

enum ConnectedState {
  injected = "injected",
}

interface ManualHeaderProps {}

// TODO: it would be great to have all this logic in a hook that we can apply to any UI element
export const ManualHeader = ({}: ManualHeaderProps): ReactElement => {
  const { enableWeb3, account, isWeb3Enabled, isWeb3EnableLoading, Moralis, deactivateWeb3 } =
    useMoralis()

  const connectWeb3 = useCallback(async () => {
    await enableWeb3()

    // store the connected state in localStorage
    window.localStorage.setItem(LocalStorage.connected, ConnectedState.injected)
  }, [enableWeb3])

  useEffect(() => {
    if (isWeb3Enabled) {
      return
    }

    const previouslyConnected = window.localStorage.getItem(LocalStorage.connected)

    if (!previouslyConnected) {
      return
    }

    connectWeb3()
  }, [isWeb3Enabled, connectWeb3])

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (account === null) {
        window.localStorage.removeItem(LocalStorage.connected)

        // TODO: I don't understand why we need to do this? It seems that the issue in the video no longer exists and was possibly fixed, ie. Connect button should show if we disconnected the account in metamask.
        deactivateWeb3()
      }
    })
  })

  const onConnectClick = useCallback(() => {
    connectWeb3()
  }, [connectWeb3])

  return (
    <div>
      {account ? (
        <div>Connected to {formatAddress(account)}</div>
      ) : (
        <button disabled={isWeb3EnableLoading} onClick={onConnectClick}>
          Connect
        </button>
      )}
    </div>
  )
}
