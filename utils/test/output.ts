import { Config, List, Value, Variants } from "../../config/mod.ts";

export const enable = Value.boolean({
  "name": "Enable",
  "default": true,
  "description": "Allow remote RPC requests.",
  "warning": null,
});
export const username = Value.string({
  "name": "Username",
  "default": "bitcoin",
  "description": "The username for connecting to Bitcoin over RPC.",
  "warning": null,
  "nullable": false,
  "masked": true,
  "placeholder": null,
  "pattern": "^[a-zA-Z0-9_]+$",
  "pattern-description": "Must be alphanumeric (can contain underscore).",
  "textarea": null,
});
export const password = Value.string({
  "name": "RPC Password",
  "default": {
    "charset": "a-z,2-7",
    "len": 20,
  },
  "description": "The password for connecting to Bitcoin over RPC.",
  "warning": null,
  "nullable": false,
  "masked": true,
  "placeholder": null,
  "pattern": '^[^\\n"]*$',
  "pattern-description": "Must not contain newline or quote characters.",
  "textarea": null,
});
export const authorizationList = List.string({
  "name": "Authorization",
  "range": "[0,*)",
  "spec": {
    "masked": null,
    "placeholder": null,
    "pattern": "^[a-zA-Z0-9_-]+:([0-9a-fA-F]{2})+\\$([0-9a-fA-F]{2})+$",
    "pattern-description":
      'Each item must be of the form "<USERNAME>:<SALT>$<HASH>".',
    "textarea": false,
  },
  "default": [],
  "description":
    "Username and hashed password for JSON-RPC connections. RPC clients connect using the usual http basic authentication.",
  "warning": null,
});
export const auth = Value.list(authorizationList);
export const serialversion = Value.enum({
  "name": "Serialization Version",
  "description":
    "Return raw transaction or block hex with Segwit or non-SegWit serialization.",
  "warning": null,
  "default": "segwit",
  "values": [
    "non-segwit",
    "segwit",
  ],
  "value-names": {},
});
export const servertimeout = Value.number({
  "name": "Rpc Server Timeout",
  "default": 30,
  "description":
    "Number of seconds after which an uncompleted RPC call will time out.",
  "warning": null,
  "nullable": false,
  "range": "[5,300]",
  "integral": true,
  "units": "seconds",
  "placeholder": null,
});
export const threads = Value.number({
  "name": "Threads",
  "default": 16,
  "description":
    "Set the number of threads for handling RPC calls. You may wish to increase this if you are making lots of calls via an integration.",
  "warning": null,
  "nullable": false,
  "range": "[1,64]",
  "integral": true,
  "units": null,
  "placeholder": null,
});
export const workqueue = Value.number({
  "name": "Work Queue",
  "default": 128,
  "description":
    "Set the depth of the work queue to service RPC calls. Determines how long the backlog of RPC requests can get before it just rejects new ones.",
  "warning": null,
  "nullable": false,
  "range": "[8,256]",
  "integral": true,
  "units": "requests",
  "placeholder": null,
});
export const advancedSpec = Config.of({
  "auth": auth,
  "serialversion": serialversion,
  "servertimeout": servertimeout,
  "threads": threads,
  "workqueue": workqueue,
});
export const advanced = Value.object({
  name: "Advanced",
  description: "Advanced RPC Settings",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: advancedSpec,
  "value-names": {},
});
export const rpcSettingsSpec = Config.of({
  "enable": enable,
  "username": username,
  "password": password,
  "advanced": advanced,
});
export const rpc = Value.object({
  name: "RPC Settings",
  description: "RPC configuration options.",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: rpcSettingsSpec,
  "value-names": {},
});
export const zmqEnabled = Value.boolean({
  "name": "ZeroMQ Enabled",
  "default": true,
  "description": "Enable the ZeroMQ interface",
  "warning": null,
});
export const txindex = Value.boolean({
  "name": "Transaction Index",
  "default": true,
  "description": "Enable the Transaction Index (txindex)",
  "warning": null,
});
export const enable1 = Value.boolean({
  "name": "Enable Wallet",
  "default": true,
  "description": "Load the wallet and enable wallet RPC calls.",
  "warning": null,
});
export const avoidpartialspends = Value.boolean({
  "name": "Avoid Partial Spends",
  "default": true,
  "description":
    "Group outputs by address, selecting all or none, instead of selecting on a per-output basis. This improves privacy at the expense of higher transaction fees.",
  "warning": null,
});
export const discardfee = Value.number({
  "name": "Discard Change Tolerance",
  "default": 0.0001,
  "description":
    "The fee rate (in BTC/kB) that indicates your tolerance for discarding change by adding it to the fee.",
  "warning": null,
  "nullable": false,
  "range": "[0,.01]",
  "integral": false,
  "units": "BTC/kB",
  "placeholder": null,
});
export const walletSpec = Config.of({
  "enable": enable1,
  "avoidpartialspends": avoidpartialspends,
  "discardfee": discardfee,
});
export const wallet = Value.object({
  name: "Wallet",
  description: "Wallet Settings",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: walletSpec,
  "value-names": {},
});
export const mempoolfullrbf = Value.boolean({
  "name": "Enable Full RBF",
  "default": false,
  "description":
    "Policy for your node to use for relaying and mining unconfirmed transactions.  For details, see https://github.com/bitcoin/bitcoin/blob/master/doc/release-notes/release-notes-24.0.md#notice-of-new-option-for-transaction-replacement-policies",
  "warning": null,
});
export const persistmempool = Value.boolean({
  "name": "Persist Mempool",
  "default": true,
  "description": "Save the mempool on shutdown and load on restart.",
  "warning": null,
});
export const maxmempool = Value.number({
  "name": "Max Mempool Size",
  "default": 300,
  "description": "Keep the transaction memory pool below <n> megabytes.",
  "warning": null,
  "nullable": false,
  "range": "[1,*)",
  "integral": true,
  "units": "MiB",
  "placeholder": null,
});
export const mempoolexpiry = Value.number({
  "name": "Mempool Expiration",
  "default": 336,
  "description":
    "Do not keep transactions in the mempool longer than <n> hours.",
  "warning": null,
  "nullable": false,
  "range": "[1,*)",
  "integral": true,
  "units": "Hr",
  "placeholder": null,
});
export const mempoolSpec = Config.of({
  "mempoolfullrbf": mempoolfullrbf,
  "persistmempool": persistmempool,
  "maxmempool": maxmempool,
  "mempoolexpiry": mempoolexpiry,
});
export const mempool = Value.object({
  name: "Mempool",
  description: "Mempool Settings",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: mempoolSpec,
  "value-names": {},
});
export const listen = Value.boolean({
  "name": "Make Public",
  "default": true,
  "description": "Allow other nodes to find your server on the network.",
  "warning": null,
});
export const onlyconnect = Value.boolean({
  "name": "Disable Peer Discovery",
  "default": false,
  "description": "Only connect to specified peers.",
  "warning": null,
});
export const onlyonion = Value.boolean({
  "name": "Disable Clearnet",
  "default": false,
  "description": "Only connect to peers over Tor.",
  "warning": null,
});
export const hostname = Value.string({
  "name": "Hostname",
  "default": null,
  "description": "Domain or IP address of bitcoin peer",
  "warning": null,
  "nullable": false,
  "masked": null,
  "placeholder": null,
  "pattern":
    "(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|((^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)|(^[a-z2-7]{16}\\.onion$)|(^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$))",
  "pattern-description":
    "Must be either a domain name, or an IPv4 or IPv6 address. Do not include protocol scheme (eg 'http://') or port.",
  "textarea": null,
});
export const port = Value.number({
  "name": "Port",
  "default": null,
  "description": "Port that peer is listening on for inbound p2p connections",
  "warning": null,
  "nullable": true,
  "range": "[0,65535]",
  "integral": true,
  "units": null,
  "placeholder": null,
});
export const addNodesSpec = Config.of({ "hostname": hostname, "port": port });
export const addNodesList = List.obj({
  name: "Add Nodes",
  range: "[0,*)",
  spec: {
    spec: addNodesSpec,
    "display-as": null,
    "unique-by": null,
  },
  default: [],
  description: "Add addresses of nodes to connect to.",
  warning: null,
});
export const addnode = Value.list(addNodesList);
export const peersSpec = Config.of({
  "listen": listen,
  "onlyconnect": onlyconnect,
  "onlyonion": onlyonion,
  "addnode": addnode,
});
export const peers = Value.object({
  name: "Peers",
  description: "Peer Connection Settings",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: peersSpec,
  "value-names": {},
});
export const dbcache = Value.number({
  "name": "Database Cache",
  "default": null,
  "description":
    "How much RAM to allocate for caching the TXO set. Higher values improve syncing performance, but increase your chance of using up all your system's memory or corrupting your database in the event of an ungraceful shutdown. Set this high but comfortably below your system's total RAM during IBD, then turn down to 450 (or leave blank) once the sync completes.",
  "warning":
    "WARNING: Increasing this value results in a higher chance of ungraceful shutdowns, which can leave your node unusable if it happens during the initial block download. Use this setting with caution. Be sure to set this back to the default (450 or leave blank) once your node is synced. DO NOT press the STOP button if your dbcache is large. Instead, set this number back to the default, hit save, and wait for bitcoind to restart on its own.",
  "nullable": true,
  "range": "(0,*)",
  "integral": true,
  "units": "MiB",
  "placeholder": null,
});
export const disabled = Config.of({});
export const size = Value.number({
  "name": "Max Chain Size",
  "default": 550,
  "description": "Limit of blockchain size on disk.",
  "warning": "Increasing this value will require re-syncing your node.",
  "nullable": false,
  "range": "[550,1000000)",
  "integral": true,
  "units": "MiB",
  "placeholder": null,
});
export const automatic = Config.of({ "size": size });
export const size1 = Value.number({
  "name": "Failsafe Chain Size",
  "default": 65536,
  "description": "Prune blockchain if size expands beyond this.",
  "warning": null,
  "nullable": false,
  "range": "[550,1000000)",
  "integral": true,
  "units": "MiB",
  "placeholder": null,
});
export const manual = Config.of({ "size": size1 });
export const pruningSettingsVariants = Variants.of({
  "disabled": disabled,
  "automatic": automatic,
  "manual": manual,
});
export const pruning = Value.union({
  name: "Pruning Settings",
  description:
    "Blockchain Pruning Options\nReduce the blockchain size on disk\n",
  warning:
    "If you set pruning to Manual and your disk is smaller than the total size of the blockchain, you MUST have something running that prunes these blocks or you may overfill your disk!\nDisabling pruning will convert your node into a full archival node. This requires a resync of the entire blockchain, a process that may take several days. Make sure you have enough free disk space or you may fill up your disk.\n",
  default: "disabled",
  variants: pruningSettingsVariants,
  tag: {
    "id": "mode",
    "name": "Pruning Mode",
    "description":
      '- Disabled: Disable pruning\n- Automatic: Limit blockchain size on disk to a certain number of megabytes\n- Manual: Prune blockchain with the "pruneblockchain" RPC\n',
    "warning": null,
    "variant-names": {
      "disabled": "Disabled",
      "automatic": "Automatic",
      "manual": "Manual",
    },
  },
  "display-as": null,
  "unique-by": null,
  "variant-names": null,
});
export const blockfilterindex = Value.boolean({
  "name": "Compute Compact Block Filters (BIP158)",
  "default": true,
  "description":
    "Generate Compact Block Filters during initial sync (IBD) to enable 'getblockfilter' RPC. This is useful if dependent services need block filters to efficiently scan for addresses/transactions etc.",
  "warning": null,
});
export const peerblockfilters = Value.boolean({
  "name": "Serve Compact Block Filters to Peers (BIP157)",
  "default": false,
  "description":
    "Serve Compact Block Filters as a peer service to other nodes on the network. This is useful if you wish to connect an SPV client to your node to make it efficient to scan transactions without having to download all block data.  'Compute Compact Block Filters (BIP158)' is required.",
  "warning": null,
});
export const blockFiltersSpec = Config.of({
  "blockfilterindex": blockfilterindex,
  "peerblockfilters": peerblockfilters,
});
export const blockfilters = Value.object({
  name: "Block Filters",
  description: "Settings for storing and serving compact block filters",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: blockFiltersSpec,
  "value-names": {},
});
export const peerbloomfilters = Value.boolean({
  "name": "Serve Bloom Filters to Peers",
  "default": false,
  "description":
    "Peers have the option of setting filters on each connection they make after the version handshake has completed. Bloom filters are for clients implementing SPV (Simplified Payment Verification) that want to check that block headers  connect together correctly, without needing to verify the full blockchain.  The client must trust that the transactions in the chain are in fact valid.  It is highly recommended AGAINST using for anything except Bisq integration.",
  "warning":
    "This is ONLY for use with Bisq integration, please use Block Filters for all other applications.",
});
export const bloomFiltersBip37Spec = Config.of({
  "peerbloomfilters": peerbloomfilters,
});
export const bloomfilters = Value.object({
  name: "Bloom Filters (BIP37)",
  description: "Setting for serving Bloom Filters",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: bloomFiltersBip37Spec,
  "value-names": {},
});
export const advancedSpec1 = Config.of({
  "mempool": mempool,
  "peers": peers,
  "dbcache": dbcache,
  "pruning": pruning,
  "blockfilters": blockfilters,
  "bloomfilters": bloomfilters,
});
export const advanced1 = Value.object({
  name: "Advanced",
  description: "Advanced Settings",
  warning: null,
  default: null,
  "display-as": null,
  "unique-by": null,
  spec: advancedSpec1,
  "value-names": {},
});
export const config = Config.of({
  "rpc": rpc,
  "zmq-enabled": zmqEnabled,
  "txindex": txindex,
  "wallet": wallet,
  "advanced": advanced1,
});
