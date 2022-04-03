import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Color from '../abis/Color.json'

import { create } from 'ipfs-http-client'
const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    // Loading contract
    const networkData = Color.networks[networkId]
    console.log(networkData)
    if(networkData) {
      const abi = Color.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Colors
      const userData = await contract.methods.userInfo(this.state.account).call()
      if (userData) {
      this.setState({
        'username' : userData.name,
        'userdesc' : userData.description,
      })
      console.log(userData)
    }

      console.log('totalSupply', totalSupply)
      for (var i = 1; i <= totalSupply; i++) {
        const nftMetadata = await contract.methods.nftMetadata(i - 1).call()
        const nftOwner = await contract.methods.getOwnerData(i - 1).call()
        nftMetadata.owner = nftOwner
        console.log(nftMetadata)
        this.setState({
          nftMetadatas: [...this.state.nftMetadatas, nftMetadata]
        })
      }
      console.log(this.state.nftMetadata)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

   mint = async (color, hash, desc, link) => {
    try{
      var data = await this.state.contract.methods.mint(color, hash, desc, link).send({ from: this.state.account })
      // .once('receipt', (receipt) => {
      //   this.setState({
      //     colors: [...this.state.colors, color]
      //   })
      // })
    }
    catch (err) {
      let message = err.message.substring(49).trim().replace("'", "")
      message = JSON.parse(message).value.data.data;
      alert(message[Object.keys(message)[0]].reason);
    }
  }
  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  async onSubmit(event) {
    event.preventDefault()
    // ipfs.files.add(this.state.buffer, (error, result) => {
    //   if(error) {
    //     console.error(error)
    //     return
    //   }
    //   this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
    //     console.log('ifpsHash', this.state.ipfsHash)
    //     return this.setState({ ipfsHash: result[0].hash })
    //   })
    // })
    console.log(ipfs.add)
    try {
      const result = await ipfs.add(this.state.buffer)
      console.log('ipfsHash', result.path)
      // this.setState({ ipfsHash: result[0].hash })
      this.mint(this.state.username, result.path, this.state.userdesc, "https://ipfs.io/ipfs/" + result.path)

    } catch (err) {console.error(err)}
    // const result = await ipfs.add(this.state.buffer)
    // console.log(result.path)
  }

  async registerUser(event) {
    event.preventDefault()
    // this.setState({})
    var username = event.target.username.value
    var userdesc = event.target.userdesc.value
    var usn = event.target.usn.value
    try {
      var data = await this.state.contract.methods.registerUser(username, userdesc, usn).send({ from: this.state.account })
      this.setState({
        username: username,
        userdesc: userdesc,
        usn : usn
      })
    }
    catch (err){
      let message = err.message.substring(49).trim().replace("'", "")
      message = JSON.parse(message).value.data.data;
      alert(message[Object.keys(message)[0]].reason);
    }

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      nftMetadatas: [],
      username: "ALPHA",
      userdesc : "ALPHA"
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  render() {
    return (
      <div>

        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white ml-2"><span id="account">{this.state.account}</span></small>
              <small className="text-white ml-2"><span id="username">{this.state.username}</span></small>
              <small className="text-white ml-2"><span id="userdesc">{this.state.userdesc}</span></small>
            </li>
          </ul>
        </nav>
        



        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <form onSubmit={this.registerUser}>
          <input type="text" name="username" placeholder="username"  />
          <input type="text" name="userdesc" placeholder="userdesc"  />
          <input type="text" name="usn" placeholder="usn"  />
          <input type="submit" placeholder='register user' />
        </form>
                <h1>Issue Token</h1>
                <form onSubmit={this.onSubmit}>
                  {/* <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.color = input }}
                  /> */}
                  {/* Image input */}
                  <input type='file' onChange={this.captureFile} />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.nftMetadatas.map((nftMetadata, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  {/* <div className="token" style={{ backgroundColor: 'red' }}></div> */}
                  <div>
                    <img src={nftMetadata.link} alt='' width={300} height={300} />
                    <div>
                    {nftMetadata.owner}
                    <hr/>
                    {/* {nftMetadata.owner.address} */}
                    </div>
                    </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
