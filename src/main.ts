import Surfshark from "./surfShark";
import Wireguard, { WgConfigObject } from "./wireGuard";
import ipCheck from "./ipCheck";
import settings from './settings';

const main = async () => {
  const surfshark = new Surfshark();
  const wireguard = new Wireguard();

  await surfshark.login({
    username: settings.surfsharkUser,
    password: settings.surfsharkPassword,
  });

  await surfshark.loadServers();

  const p2pServers = surfshark.getServersIncludingTags(['p2p', 'physical']);
  const selectedServer = p2pServers[0];
  console.log(selectedServer);

  const wireGuardConfig: WgConfigObject = {
    wgInterface: {
      address: ["10.14.0.2/8"],
      privateKey: wireguard?.myPrivateKey,
      mtu: 1420,
    },
    peers: [
      {
        allowedIps: ["0.0.0.0/0"],
        endpoint: `${selectedServer?.hostname}:${selectedServer?.wireguard?.port}`,
        publicKey: selectedServer?.wireguard?.publicKey,
        persistentKeepalive: 25,
      },
    ],
  };

  await wireguard.setConfig(wireGuardConfig);
  await surfshark.sendPublicKey(wireguard?.myPublickey); //send public key
  await wireguard.restart();
};

main();


setInterval(async () => {
  const ip = await ipCheck();
  console.log("My ip: ", ip);
}, 60000)