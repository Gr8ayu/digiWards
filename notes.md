c = await Color.deployed()

nos = await c.totalSupply()
next_token = nos.toNumber()


c.registerUser("Ayush", "Gr8ayu", "1rv18is009")

c.mint("red", "#RED", "blood", "www.red.com")
c.ownerOf(0)

c.userInfo("0x66CdBBC5720b3264A8ce63ad4355288843173Bb4")
c.nftMetadata(0)

web3.eth.getAccounts(function(err,res) { accounts = res; });

c.sendToken("0x66CdBBC5720b3264A8ce63ad4355288843173Bb4", 1)

ipfs
truffle
solidity
ganache
nft
erc721
web3.js