
export function stringToBinary(str: string): string[] {
  return str.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  });
}

export function binaryToString(binaryArray: string[]): string {
  return binaryArray.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

export function encodeDualLayer(code: string): string {
  // Layer 2: Base64 encoding
  return btoa(code);
}

export function decodeDualLayer(encoded: string): string {
  // Layer 2: Base64 decoding
  try {
    return atob(encoded);
  } catch (e) {
    return encoded; // Fallback if not base64
  }
}

/**
 * Simulates AI-powered region detection.
 */
export async function detectRegion(): Promise<{ x: number, y: number, w: number, h: number }> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    x: 15 + Math.random() * 10,
    y: 20 + Math.random() * 10,
    w: 60 + Math.random() * 5,
    h: 50 + Math.random() * 5
  };
}

/**
 * Simulates the extraction process.
 */
export async function simulateExtraction(encoded: string, onProgress: (bit: string) => void): Promise<string[]> {
  const binary = stringToBinary(encoded);
  const allBits = binary.join('').split('');
  
  // Only show first 128 bits for animation performance
  const displayBits = allBits.slice(0, 128);
  
  for (const bit of displayBits) {
    onProgress(bit);
    await new Promise(resolve => setTimeout(resolve, 5)); // Faster for more bits
  }
  
  return binary;
}
