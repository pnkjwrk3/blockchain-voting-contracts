import React, { Component } from "react";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./utils/getWeb3";
import TestListCandidates from "./testlist.js"
import Status from "./status.js"
import { register } from './ContractFunctions'
import { login } from './ContractFunctions'


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      candidates: [],
      web3: null, accounts: null,
      account: "0x0",
      newContractInstance: null,
      candidatename: "",
      conaddress: undefined,
      conname: "",
      voteStart: false,
      voteEnd: false,
      loadStatus: false,
      loadcand: false,
      MyContract: null
    };

    this.addCandidate = this.addCandidate.bind(this);

  }


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.      
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const account = await web3.eth.getCoinbase(); console.log("accounts 1 "+account);

      // Get the contract instance.

      //from Dashboard.js
      const MyContract = new web3.eth.Contract(ElectionContract.abi, this.state.conaddress);

      this.setState({ web3, account, MyContract });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  deployContract = () => {

    console.log(this.state.account);
    this.state.MyContract.deploy({
      data: ElectionContract.bytecode,
      arguments: [this.state.conname]
    }).send({
      from: this.state.account
    }).on('receipt', (receipt) => {
      console.log(receipt.contractAddress) // contains the new contract address
    }).then((MyContract) => {
      console.log(MyContract.options.address) // instance with the new contract address
      this.setState({ MyContract, conaddress: MyContract.options.address })
      this.saveDb();
    });
    
  }

  saveDb = () => {
    const cont = {
      name: this.state.conname,
      address: this.state.conaddress
    }

    register(cont).then(res => {
      console.log("saved")
    })
  }

  loadContract = async () => {
    const contload = {
      name: this.state.conname
    }

    await login(contload).then(res => {
      if (res) {
        console.log(res.address)
        this.setState({ conaddress: res.address })
      }
    })

    const MyContract = new this.state.web3.eth.Contract(ElectionContract.abi, this.state.conaddress);

    MyContract.methods.votingStarted().call().then((start) => this.setState({ voteStart: start }))
    MyContract.methods.votingEnded().call().then((end) => this.setState({ voteEnd: end }))

    this.setState({MyContract})

    //alert(this.state.conname + " has been loaded")
  }

  loadCandidates = () => {
    this.state.MyContract.methods.candidatesCount().call().then((candidatesCount) => {
      for (var i = 1; i <= candidatesCount; i++) {
        this.state.MyContract.methods.candidates(i).call().then((candidate) => {
          const candidates = [...this.state.candidates]
          candidates.push({
            id: candidate[0],
            name: candidate[1],
            voteCount: candidate[2]
          });
          this.setState({ candidates: candidates })
        });
      }
    })
    this.setState({ loadStatus: true })
  }


  onChange = (e) => this.setState({ candidatename: e.target.value })
  onChangecon = (e) => this.setState({ conname: e.target.value })
  onChangecona = (e) => this.setState({ conname: e.target.value })


  addCandidate() {
    this.state.MyContract.methods.addCandidate(this.state.candidatename).send({ from: this.state.account }).on('transactionHash', (hash) =>
      console.log(this.state.candidatename + hash)
    )
  }


  beginvote = () => this.state.MyContract.methods.begin().send({ from: this.state.account }).on('transactionHash', (hash) => console.log(hash))

  endvote = () => this.state.MyContract.methods.end().send({ from: this.state.account }).on('transactionHash', (hash) => console.log(hash))

  emptylocal() {
    localStorage.removeItem('coninst')
  }

  render() {
    return (
      <div className="container">
        <h1>Good to Go!</h1>

        <h2 onClick={() => this.setState({ loadStatus: !this.state.loadStatus })}>Status</h2>
        {this.state.loadStatus ? <Status state={this.state} /> : null}

        <b>Contract Address: </b> {this.state.conaddress}
        <br />

        <input type="text" className="form-control" name="conname" placeholder="Enter election constituency" value={this.state.conname} onChange={this.onChangecon} />
        <button onClick={this.deployContract} style={{ marginLeft: '15px' }}>deployContract</button>
        <br></br>

        <input type="text" className="form-control" name="conname1" placeholder="Enter name constituency" value={this.state.conname} onChange={this.onChangecona} />
        <button onClick={this.loadContract} style={{ marginLeft: '12px' }}>loadContract</button>
        <br></br>

        <button onClick={this.beginvote} style={{ margin: '15px' }}>begin</button>
        <button onClick={this.endvote} style={{ margin: '15px' }}>end</button>
        <br />

        <input type="text" className="form-control" name="candidatename" placeholder="Enter candidate Name" value={this.state.candidatename} onChange={this.onChange} />
        <button onClick={this.addCandidate} style={{ margin: '15px' }}>addcandidate</button>
        <br />

        <h2 onClick={() => this.setState({ loadcand: !this.state.loadcand })}>Candidates</h2>
        <div style={{ margin: '15px' }}>
          {this.state.loadcand ? <TestListCandidates state={this.state} /> : null}
        </div>
      </div>
    );
  }
}

export default App;
