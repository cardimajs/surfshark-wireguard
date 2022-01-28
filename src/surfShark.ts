import axios, { AxiosInstance } from "axios";
import { VPNServer } from "./types";

interface GenericCluster {
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  load: number;
  id: string;
  coordinates: { longitude: number; latitude: number };
  info: { id: string; entry: { value: string } }[];
  type: string;
  location: string;
  connectionName: string;
  pubKey: string;
  tags: string[];
  transitCluster: any;
  flagUrl: string;
}

interface ServerUser {
  city: string;
  country: string;
  countryCode: string;
  currency: string;
  ip: string;
  isp: string;
  restricted: boolean;
  secured: boolean;
  torrent: boolean;
  zipCode: string;
}

class SurfShark {
  private isLoggedIn: boolean;
  private baseUrl: string;
  private axios: AxiosInstance;
  private token: string;
  private renewToken: string;
  private genericCluster: GenericCluster[];
  private servers: VPNServer[];

  constructor(args?: { token?: string; renewToken?: string }) {
    this.isLoggedIn = false;
    this.axios = axios.create();
    this.baseUrl = "https://api.surfshark.com";
    this.token = args?.token || "";
    this.renewToken = args?.renewToken || "";
    this.genericCluster = [];
    this.servers = [];

    if (args?.token) {
      this.updateAxiosToken();
    }
  }

  updateAxiosToken() {
    this.axios = axios.create({
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  getServers() {
    return this.servers;
  }

  getServer(country?: string) {
    return this.servers.find((s) => s.location.country === country);
  }


  getP2pServers() {
    const p2pServers = this.servers.filter( s => s.tags.includes('p2p'));
    return p2pServers;
  }

  getServersIncludingTags(tags: string[]) {
    const selectedServer = this.servers.filter( s => tags.every( t => s.tags.includes(t)));
    return selectedServer;
  }

  async login({ username, password }: { username: string; password: string }) {
    const url = `${this.baseUrl}/v1/auth/login`;
    const res = await this.axios.post(url, {
      password,
      username, 
    });

    const data = res.data;

    console.log('login response data')
    console.log(data)

    this.token = data.token;
    this.renewToken = data.renewToken;

    this.updateAxiosToken();
    this.isLoggedIn = true;

    return res.data;
  }

  wireSharkServerMapper(server: GenericCluster): VPNServer {
    return {
      protocols: ["wireguard"],
      hostname: server.connectionName,
      tags: server.tags,
      location: {
        country: server.country,
        countryCode: server.countryCode,
        region: server.region,
        longitude: server.coordinates.longitude,
        latitude: server.coordinates.latitude,
        flagUrl: server.flagUrl,
      },
      wireguard: {
        publicKey: server.pubKey,
        port: 51820,
      },
    };
  }

  async loadServers() {
    console.log("load servers");
    const genericServers = await this.getGenericCluster();

    for (const server of genericServers) {
      this.servers.push(this.wireSharkServerMapper(server));
    }
  }

  async getGenericCluster(): Promise<GenericCluster[]> {
    const url = `${this.baseUrl}/v4/server/clusters/generic?countryCode=`;
    const res = await this.axios.get(url);
    this.genericCluster = res.data;
    return res.data;
  }

  async getServerUser(): Promise<ServerUser> {
    const url = `${this.baseUrl}/v1/server/user`;
    const res = await this.axios.get(url);
    return res.data;
  }

  async sendPublicKey(pubKey: string) {
    const url = `${this.baseUrl}/v1/account/users/public-keys`;
    const res = await axios.post(
      url,
      { pubKey },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    console.log(res.data);
    return res.data;
  }

  async validatePublicKey(pubKey: string) {
    const url = `${this.baseUrl}/v1/account/users/public-keys/validate`;
    const res = await this.axios.post(url, { pubKey });
    return res.data;
  }
}

export default SurfShark;
