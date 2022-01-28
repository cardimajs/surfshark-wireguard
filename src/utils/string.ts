const getRandomCharFromAlphabet = (alphabet: string): string => {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

const randomString = (size: number = 10) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({length:size}).map( () => {return getRandomCharFromAlphabet(alphabet)}).join("")
}


export { randomString, getRandomCharFromAlphabet }