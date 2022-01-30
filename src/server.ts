import fastify from 'fastify'
import Surfshark from "./surfShark";
import Wireguard, { WgConfigObject } from "./wireGuard";
import settings from "./settings";
import Firewall from "./firewall";
import { getMyIp } from './utils'
import { testLeaks } from './leakTest'

const server = fastify()

const surfshark = new Surfshark();
const wireguard = new Wireguard();

const startSurfshark = async () => {
  const firewall = new Firewall();
  firewall.enableLan();

  await surfshark.login({
    username: settings.surfsharkUser,
    password: settings.surfsharkPassword,
  });

  await surfshark.loadServers();

  const p2pServers = surfshark.getServersIncludingTags(["p2p", "physical"]);

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
}

server.get('/servers', async (request, reply) => {
  return surfshark.getServers()
})

server.get('/status', async (request, reply) => {
  return { status: 'OK'}
})

server.get('/my-ip', async (request, reply) => {
  const ip = await getMyIp()
  return { ip }
})

server.get('/leak-test', async (request, reply) => {
  return testLeaks()
})

server.get('/disconnect', async (request, reply) => {
  await wireguard.disconnect()
  return { status: 'ok'}
})

server.get('/connect/:serverHostname', async (request, reply) => {
  const { serverHostname } = request.params as any
  console.log("CONNECT TO => ", serverHostname)
  const selectedServer = surfshark.getServers().find( server => server.hostname === serverHostname)

  console.log(selectedServer)

  if(!selectedServer) {
    return { error: 'server not found!'}
  }

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
  // await surfshark.sendPublicKey(wireguard?.myPublickey); //send public key
  await wireguard.restart();
  return  selectedServer
})

const start = async () => {
  await server.listen(4000, '::')
  console.log('Server listening on port 4000')
}

start()
startSurfshark()