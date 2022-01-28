import axios from 'axios'

const getMyIp = async () => {
  const res = await axios.get('https://ifconfig.me')
  return res.data
}

export { getMyIp }