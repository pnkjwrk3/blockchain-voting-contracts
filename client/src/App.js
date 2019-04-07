import React, { Component } from "react";
import ElectionContract from "./contracts/Election.json";
// import getWeb3 from "./utils/getWeb3";
import Web3 from 'web3'
//import ListCandidates from "./listcandidates.js";
import TestListCandidates from "./testlist.js"
import Status from "./status.js"
import { register } from './ContractFunctions'
import { login } from './ContractFunctions'

// import "./App.css";

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      candidates: [],
      web3: null, accounts: null,
      argname: "",
      account: "0x0",
      newContractInstance: null,
      //networkId: ""
      candidatename: "",
      conaddress: undefined,
      conname: "",
      candidateCount: 0,
      voteStart: false,
      voteEnd: false,
      loadStatus: false,
      loadcand: false
    };

    this.addCandidate = this.addCandidate.bind(this);

  }


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.      
      if (typeof window.web3 !== 'undefined') {
        this.web3Provider = window.web3.currentProvider
      } else {
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
      }

      this.web3 = new Web3(this.web3Provider)
      //console.log(this.web3);

      // Use web3 to get the user's accounts.
      const accounts = await this.web3.eth.getAccounts(); console.log(accounts[0]);
      this.web3.eth.getCoinbase((err, account) => {
        this.setState({ account })
      });

      // Get the contract instance.

      //from Dashboard.js
      this.MyContract = new this.web3.eth.Contract(ElectionContract.abi, this.state.conaddress);
      //this.MyContract.setProvider(this.web3Provider);

      this.setState({ web3: this.web3, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  deployContract = () => {
    // this.MyContract.new({data:this.MyContract.bytecode,from:this.state.account, gas: 6721975}).then(()=>console.log(this.MyContract.address)
    console.log(this.state.account);
    this.MyContract.deploy({
      data: ElectionContract.bytecode,
      arguments: [this.state.conname]
    }).send({
      from: this.state.account
    }).on('receipt', (receipt) => {
      console.log(receipt.contractAddress) // contains the new contract address
    }).then((newContractInstance) => {
      console.log(newContractInstance.options.address) // instance with the new contract address
      this.setState({ conaddress: newContractInstance.options.address })
      this.setState({ newContractInstance })
    });
  }

  saveDb = () => {
    const cont = {
      name: this.state.conname,
      address: this.state.conaddress
    }

    register(cont).then(res => {
      // if (!res.error) {
      //     this.props.history.push(`/login`)
      // } else {
      //     console.log(res.json().error)
      //     this.setState({ error: res.json().error })
      // }
      console.log("saved")
    })
  }

  loadDb = () => {
    // localStorage.removeItem('coninst')
    const contload = {
      name: this.state.conname
    }

    login(contload).then(res => {
      if (res) {
        console.log(res.address)
        this.setState({ conaddress: res.address })
      }
    })
    //console.log("from localstorage " + JSON.parse(localStorage.getItem('coninst')).address)
    //this.setState({conaddress:localStorage.coninst['address']})
    //console.log(this.state.conaddress)
  }

  loadContract = () => {
    //this.loadDb();
    console.log(this.state.conaddress);
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.MyContract = new this.web3.eth.Contract(ElectionContract.abi, this.state.conaddress);

    this.MyContract.methods.votingStarted().call().then((start) => this.setState({ voteStart: start }))
    this.MyContract.methods.votingEnded().call().then((end) => this.setState({ voteEnd: end }))

    //this.setState({newContractInstance:this.MyContract})

    alert(this.state.conname + " has been loaded")
  }

  loadCandidates = () => {
    this.MyContract.methods.candidatesCount().call().then((candidatesCount) => {
      for (var i = 1; i <= candidatesCount; i++) {
        this.MyContract.methods.candidates(i).call().then((candidate) => {
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

  contractAddress = () => {
    console.log(this.MyContract.options.address);
    //this.setState({conaddress:this.MyContract.options.address});
  }

  onChange = (e) => this.setState({ candidatename: e.target.value })
  onChangecon = (e) => this.setState({ conname: e.target.value })
  onChangecona = (e) => this.setState({ conname: e.target.value })


  addCandidate() {
    //cname = this.state.candidatename;
    this.MyContract.methods.addCandidate(this.state.candidatename).send({ from: this.state.account }).on('transactionHash', (hash) =>
      console.log(this.state.candidatename + hash)
    )
  }

  loadCandidatesCount = () => this.MyContract.methods.candidatesCount().call().then((count) => this.setState({ candidateCount: count }));

  beginvote = () => this.MyContract.methods.begin().send({ from: this.state.account }).on('transactionHash', (hash) => console.log(hash))

  endvote = () => this.MyContract.methods.end().send({ from: this.state.account }).on('transactionHash', (hash) => console.log(hash))

emptylocal(){
  localStorage.removeItem('coninst')
}

  render() {
    return (
      <div className="container">

            <h1>Good to Go!</h1>
            <h2 onClick={() => this.setState({ loadStatus: !this.state.loadStatus })}>Status</h2>
            {this.state.loadStatus ? <Status state={this.state} conadd={this.state.conaddress} /> : null}

            <input type="text" className="form-control" name="conname" placeholder="Enter election constituency" value={this.state.conname} onChange={this.onChangecon} />
            <button onClick={this.deployContract} style={{marginLeft:'15px'}}>deploy</button>
            <button onClick={this.saveDb} style={{marginLeft:'15px'}}>saveDB</button>
            <br></br>
            <input type="text" className="form-control" name="conname1" placeholder="Enter name constituency" value={this.state.conname} onChange={this.onChangecona} />
            <button onClick={this.loadDb} style={{marginLeft:'15px'}}>loadDb</button>
            <button onClick={this.loadContract} style={{marginLeft:'12px'}}>loadContract</button>

            <br/>
            <br/>
            <button onClick={this.contractAddress}  style={{marginLeft:'15px'}}>CurrentAddress</button>{this.state.conaddress}
            <br></br>


            <button onClick={this.beginvote} style={{margin:'15px'}}>begin</button>
            <button onClick={this.endvote} style={{margin:'15px'}}>end</button>

            {/* <ListCandidates candidates={this.state.candidates} /> */}

<br />
            <button onClick={this.loadCandidatesCount} style={{marginLeft:'15px'}}>loadCandidatesCount</button> {this.state.candidateCount}

            <br />
            <input type="text"
              className="form-control"
              name="candidatename"
              placeholder="Enter candidate Name"
              value={this.state.candidatename}
              onChange={this.onChange}
            />
            <button onClick={this.addCandidate} style={{margin:'15px'}}>addcandidate</button>
            <br />

            <h2 onClick={() => this.setState({ loadcand: !this.state.loadcand })}>Candidates</h2>
            <div style={{margin:'15px'}}>
            {this.state.loadcand ? <TestListCandidates conadd={this.state.conaddress} /> : null}
            </div>

      </div>
    );
  }
}

export default App;
