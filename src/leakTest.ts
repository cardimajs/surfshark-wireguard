import axios from 'axios'
import {randomString} from './utils'

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

const testLeaks = async () => {
  const promises = [
    dnsLeakTest(),
    ipCheck()
  ]

  const result = await Promise.all(promises)
  return {
    dns: result[0],
    ip: result[1]
  }
}

export { dnsLeakTest, ipCheck, testLeaks }
