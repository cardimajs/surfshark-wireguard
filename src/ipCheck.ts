import axios from 'axios';

const ipCheck = async() => {
  const res = await axios.get("http://ifconfig.me");
  return res.data;
}

export default ipCheck;