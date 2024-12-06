
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function CurrencyToggle({onSelect}: {onSelect: (value: string) => void}) {
  return (
    <ToggleGroup type="single" defaultValue="usd" onValueChange={(val) => onSelect(val)}>
      <ToggleGroupItem value="usd" aria-label="Toggle bold" className="rounded-none">
        USD
      </ToggleGroupItem>
      <ToggleGroupItem value="btc" aria-label="Toggle italic" className="rounded-none">
        BTC
      </ToggleGroupItem>
      <ToggleGroupItem value="eth" aria-label="Toggle strikethrough" className="rounded-none">
        ETH
      </ToggleGroupItem>
      <ToggleGroupItem value="other" aria-label="Toggle strikethrough" className="rounded-none">
        ...
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
