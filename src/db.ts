import { Low, JSONFile } from 'lowdb'

const main = async () => {
  const file = 'db.json'
  const adapter = new JSONFile(file)
  const db = new Low(adapter)
  
  await db.read()

  const defaultData = {
    loginInfo: {
      token: "",
      renewToken: "",
      lastLogin: "Date",
      tokenExpire: "Date"
    }
  }

  db.data ||= defaultData


  console.log(db.data)

}

main()