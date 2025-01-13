import React, { useContext } from 'react'

export interface Token {
  name: string;
  amount: number;
  purchased: Date;
}

interface DashboardContextType {
  tokens: Token[];
  setTokens: (tokens: Token[]) => void; 
  portfolioValue: number;
  setPortfolioValue: (value: number) => void;
}

const defaultDashboardContext: DashboardContextType = {
  tokens: [],
  setTokens: () => {},
  portfolioValue: 0,
  setPortfolioValue: () => {},
}

const DashboardContext = React.createContext<DashboardContextType>(defaultDashboardContext)

export function useDashboard() {
  return useContext(DashboardContext);
}

export default function DashboardProvider(props: { children: any }) {
  const [tokens, setTokens] = React.useState<Token[]>([])
  const [portfolioValue, setPortfolioValue] = React.useState<number>(0)

  const value: DashboardContextType = {
    tokens,
    setTokens,
    portfolioValue,
    setPortfolioValue,
  }

  return (
    <DashboardContext.Provider value={value}>
      {props.children}
    </DashboardContext.Provider>
  )
}
