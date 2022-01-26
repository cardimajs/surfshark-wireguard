import axios from 'axios'

const getRandomCharFromAlphabet = (alphabet: string): string => {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

const randomString = (size: number = 10) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({length:size}).map( () => {return getRandomCharFromAlphabet(alphabet)}).join("")
}

const dnsLeakTest = async (): Promise<boolean> => {
  const randomText = randomString(50)
  const url = `https://${randomText}.catchdns.com/`
  const response = await axios.get(url)
  for(const key of Object.keys(response.data)){
    if(response.data[key].Leak) {
      return true
    }
  }
  return false
}

const ipCheck = async (): Promise<boolean> => {
  const url = "https://surfshark.com/api/v1/server/user"
  const response = await axios.get(url)
  return !response.data.secured
}

export { dnsLeakTest }
