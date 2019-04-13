import React, { Component } from 'react'

class Status extends Component {

    state = {
        voteStart1: false,
        voteEnd1: false,
        candidateCount:'0'
    }

    componentDidMount = async () => {
            this.props.state.MyContract.methods.votingStarted().call().then((start) => this.setState({ voteStart1: start }))
            this.props.state.MyContract.methods.votingEnded().call().then((end) => this.setState({ voteEnd1: end }))
            this.props.state.MyContract.methods.candidatesCount().call().then((candidateCount) => this.setState({ candidateCount }))
    };

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
                                <td>Voting started?</td>
                                <td>{this.state.voteStart1.toString()}</td>
                            </tr>
                            <tr>
                                <td>Voting ended?</td>
                                <td>{this.state.voteEnd1.toString()}</td>
                            </tr>
                            <tr>
                                <td>Candidates Count </td>
                                <td>{this.state.candidateCount}</td>
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