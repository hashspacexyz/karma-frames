export const formatValue = (value: number) => {
  const format = (val: number, decimals: number) => {
    return decimals === 0 ? val.toFixed(0) : val.toFixed(decimals)
  }

  if (value === 0) {
    return "0"
  } else if (value < 0.01 && value > 0) {
    return value.toFixed(8)
  } else if (value >= 1_000_000_000_000_000) {
    return `>999${sixthSpace}T`
  } else if (value >= 1_000_000_000) {
    const decimals = value % 1_000_000_000 === 0 ? 0 : 1
    return format(value / 1_000_000_000, decimals) + `${sixthSpace}B`
  } else if (value >= 1_000_000) {
    const decimals = value % 1_000_000 === 0 ? 0 : 1
    return format(value / 1_000_000, decimals) + `${sixthSpace}M`
  } else if (value >= 1_000) {
    const decimals = value % 1_000 === 0 ? 0 : 1
    return format(value / 1_000, decimals) + `${sixthSpace}K`
  } else {
    const decimals = value % 1 === 0 ? 0 : 2
    return format(value, decimals)
  }
}

const sixthSpace = "\u2006" // 1/6 an em
