interface Provider {
  name: string;
  servers: VPNServer[];
}

interface VPNServer {
  protocols: string[];
  hostname: string;
  tags: string[];
  location: {
    country: string;
    countryCode: string;
    region: string;
    latitude: number;
    longitude: number;
    flagUrl: string;
  };
  wireguard?: {
    publicKey: string;
    port?: number;
  };
  openvpn?: {
    port?: number;
  };
}

export { Provider, VPNServer };

// const surfShark: Provider = {
//   name: "Surf Shark",
//   servers: [
//     {
//       protocols: ["openvpn", "wireguard"],
//       hostname: "ar-bua.prod.surfshark.com",
//       location: {
//         country: "Albania",
//         countryCode: "AL",
//         region: "Europe",
//         longitude: -58.6725,
//         latitude: -34.5875,
//         flagUrl: "https://cdn.ss-cdn.com/assets/flags/AR.png",
//       },
//       wireguard: {
//         publicKey: "l8EOWPyzt/njrb74CADY4VOhns/TbUN6KFTbytHcFQw=",
//         port: 51820,
//       },
//     },
//   ],
// };
