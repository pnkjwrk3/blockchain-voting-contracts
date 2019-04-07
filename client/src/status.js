import React, { Component } from 'react'
import ElectionContract from "./contracts/Election.json";
import Web3 from 'web3'

class Status extends Component {

    state = {
        voteStart1: false,
        voteEnd1: false,
        conadd: this.props.conadd
    }

    componentDidMount = async () => {
        try {

            if (typeof window.web3 !== 'undefined') {
                this.web3Provider = window.web3.currentProvider
            } else {
                this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
            }

            this.web3 = new Web3(this.web3Provider)

            this.MyContract = new this.web3.eth.Contract(ElectionContract.abi, this.state.conadd);
            this.MyContract.methods.votingStarted().call().then((start) => this.setState({ voteStart1: start }))
            this.MyContract.methods.votingEnded().call().then((end) => this.setState({ voteEnd1: end }))

        } catch (error) {
            // alert(
            //     `Failed to load web3, accounts, or contract. Check console for details.`,
            // );
            console.error(error);
        }
    };


    render() {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    {/* <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">Status</h1>
                    </div> */}
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
                                <td>Voting started?</td>
                                <td>{this.state.voteStart1.toString()}</td>
                            </tr>
                            <tr>
                                <td>Voting ended?</td>
                                <td>{this.state.voteEnd1.toString()}</td>
                            </tr>
                            <tr>
                                <td>Account</td>
                                <td>{this.props.state.account}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
export default Status