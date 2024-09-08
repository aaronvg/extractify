'use client'

import { Provider, createStore } from 'jotai'
import { createJSONStorage } from 'jotai/utils'
import type { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage'

export const atomStore = createStore()


export const vscodeLocalStorageStore: SyncStorage<any> = createJSONStorage(() => window.localStorage)
export const sessionStore: SyncStorage<any> = createJSONStorage(() => sessionStorage)

export default function JotaiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={atomStore}>
      {children}
    </Provider>
  )
}
