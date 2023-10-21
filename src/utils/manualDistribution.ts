import { parseEther } from "viem"

export const getTier = (value: string) => {
  const bigValue = BigInt(value);
  if(bigValue < parseEther("1000"))
  return 0;
  if(bigValue < parseEther("50000"))
  return 1;
  return 2;
}