import React, { Component } from 'react'
import ConstituencyContract from "./contracts/Constituency.json"
import getWeb3 from "./utils/getWeb3";

class StoreContract extends Component {

    state = {
        newContract:null,
        conadd:"0x45948643449418Cd0627990Ff8446a01082E9C13",
        web3:null
    }

    componentDidMount = async () => {
           // this.props.state.MyContract.methods.votingStarted().call().then((start) => this.setState({ voteStart1: start }))
        const web3 = await getWeb3();
        const newContract = new web3.eth.Contract(ConstituencyContract.abi, this.state.conadd);
        this.setState({newContract,web3})
    };

    saveToContract = () =>{
    const newContract = new this.props.state.web3.eth.Contract(ConstituencyContract.abi, this.state.conadd);
    newContract.methods.addCostituency(this.props.state.conname,this.props.state.conaddress).send({ from: this.props.state.account }).on('transactionHash', (hash) =>
    console.log(this.props.state.conname + hash)
    )
    }
      

    render() {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                            <tr>
                                <td>Contract Name</td>
                                <td>{this.props.state.conname}</td>
                            </tr>
                            <tr>
                                <td>Contract Address</td>
                                <td>{this.props.state.conaddress}</td>
                            </tr>
                            <tr>
                                <td>Account</td>
                                <td>{this.props.state.account}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button onClick={this.saveToContract} style={{ marginLeft: '15px' }}>deployContract</button>
            </div>
        )
    }
}
export default StoreContract