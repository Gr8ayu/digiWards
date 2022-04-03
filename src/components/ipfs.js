// const IPFS = require('ipfs-api')
// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

import { create } from 'ipfs-http-client'
// const ipfs = create(new URL('https://ipfs.infura.io:5001'))
const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
export default {ipfs}