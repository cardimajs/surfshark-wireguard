import dotenv from 'dotenv'
dotenv.config()

export default {
  get killSwitch(): boolean {
    return process.env.kill_SWITCH === "true" || true;
  },
  get configFolder(): string {
    return process.env.CONFIG_FOLDER || "/config";
  },
  get surfsharkUser(): string {
    return process.env.SURFSHARK_USER || ""
  },
  get surfsharkPassword(): string {
    return process.env.SURFSHARK_PASSWORD || ""
  },
  get network(): string {
    return process.env.NETWORK || ""
  }
};
