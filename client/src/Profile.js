import React, { Component } from 'react'

class Profile extends Component {

    render() {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">Status</h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                            <tr>
                                <td>Contract Name</td>
                                <td>{this.props.conname}</td>
                            </tr>
                            <tr>
                                <td>Contract Address</td>
                                <td>{this.props.conaddress}</td>
                            </tr>
                            <tr>
                                <td>Voting started?</td>
                                <td>{this.props.voteStart}</td>
                            </tr>
                            <tr>
                                <td>Voting ended?</td>
                                <td>{this.props.voteEnd}</td>
                            </tr>
                            <tr>
                                <td>Account</td>
                                <td>{this.props.account}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
export default Profile