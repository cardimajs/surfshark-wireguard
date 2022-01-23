import settings from "./settings";
import exec from "./utils/exec";

class Firewall {
  async enableLan() {
    if (!settings.network) {
      return;
    }
    console.log("ENABLING LAN");
    const command = `ip route add ${settings.network} via $(ip route | grep default | awk '{print $3}')`;
    console.log(command);
    await exec(command);
  }
}

export default Firewall;
