import { formatEther } from "viem"

export const readableBigNumber = ( value: bigint, decimals?: number) => {
  if(decimals === 0)
    return parseInt(formatEther(value)).toLocaleString();
  if(decimals === undefined)
    return parseFloat(formatEther(value)).toLocaleString();
  return parseFloat(formatEther(value)).toLocaleString(undefined, { maximumFractionDigits: decimals });
}