import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function Capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function calculateUPCCheckDigit(elevenDigits: string): number {
  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < 11; i++) {
    const num = parseInt(elevenDigits[i]);
    if (i % 2 === 0) {
      oddSum += num;
    } else {
      evenSum += num;
    }
  }

  const totalSum = (oddSum * 3) + evenSum;
  const nextMultipleOfTen = Math.ceil(totalSum / 10) * 10;
  return nextMultipleOfTen - totalSum;
}

export function generateOfficialUPC(nextSequenceNumber: number): string {
  const companyPrefix = "880976";

  const sequenceStr = String(nextSequenceNumber).padStart(5, "0");
  
  const firstEleven = `${companyPrefix}${sequenceStr}`;
  const checkDigit = calculateUPCCheckDigit(firstEleven);
  
  return `${firstEleven}${checkDigit}`;
}


