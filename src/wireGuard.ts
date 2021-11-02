import { WgConfig, checkWgIsInstalled, WgConfigObject } from "wireguard-tools";
import config from "./settings";

class WireGuard {
  private configFolder: string;
  private wgInstance?: WgConfig;
  public myPublickey: string;
  public myPrivateKey: string;

  constructor() {
    this.configFolder = config.configFolder;
    this.myPrivateKey = "";
    this.myPublickey = "";
    this.start();
  }

  async start() {
    await checkWgIsInstalled();
  }

  async setConfig(config: WgConfigObject) {
    const configPath = `${this.configFolder}/wg0.conf`;
    this.wgInstance = new WgConfig({ ...config, filePath: configPath });
    const { publicKey, privateKey } = await this.wgInstance.generateKeys();
    this.myPublickey = publicKey;
    this.myPrivateKey = privateKey;
    await this.saveConfig();
  }

  async saveConfig() {
    if (!this.wgInstance) throw new Error();
    await this.wgInstance.writeToFile();
  }

  async connect() {
    if (!this.wgInstance) throw new Error();
    await this.wgInstance.up();
  }

  async disconnect() {
    if (!this.wgInstance) throw new Error();
    await this.wgInstance.down();
  }

  async restart() {
    if (!this.wgInstance) throw new Error();
    await this.wgInstance.restart();
  }
}

export default WireGuard;
export { WgConfigObject };
