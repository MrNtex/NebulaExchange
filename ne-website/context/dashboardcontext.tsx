import React, { useContext } from 'react'

export interface Token {
  name: string;
  amount: number;
  purchased: Date;
}

interface DashboardContextType {
  tokens: Token[];
  setTokens: (tokens: Token[]) => void; 
}

const defaultDashboardContext: DashboardContextType = {
  tokens: [],
  setTokens: () => {},
}

const DashboardContext = React.createContext<DashboardContextType>(defaultDashboardContext)

export function useDashboard() {
  return useContext(DashboardContext);
}

export default function DashboardProvider(props: { children: any }) {
  const [tokens, setTokens] = React.useState<Token[]>([])

  const value: DashboardContextType = {
    tokens,
    setTokens,
  }

  return (
    <DashboardContext.Provider value={value}>
      {props.children}
    </DashboardContext.Provider>
  )
}
