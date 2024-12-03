
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function CurrencyToggle({onSelect}: {onSelect: (value: string) => void}) {
  return (
    <ToggleGroup type="single" defaultValue="usd" onValueChange={(val) => onSelect(val)}>
      <ToggleGroupItem value="usd" aria-label="Toggle bold">
        USD
      </ToggleGroupItem>
      <ToggleGroupItem value="btc" aria-label="Toggle italic">
        BTC
      </ToggleGroupItem>
      <ToggleGroupItem value="eth" aria-label="Toggle strikethrough">
        ETH
      </ToggleGroupItem>
      <ToggleGroupItem value="other" aria-label="Toggle strikethrough">
        ...
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
