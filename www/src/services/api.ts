import axios from "axios";

const req = axios.create({
  baseURL: "http://localhost:4000",
});

const connect = async (hostname: string): Promise<boolean> => {
  const res = req.get(`/connect/${hostname}`);
  return true;
};

const disconnect = async (): Promise<boolean> => {
  const res = req.get("/disconnect");
  return true;
};

const leakTest = async () => {
  const res = await req.get("/leak-test");
  return res.data;
};

export { connect, disconnect, leakTest };
