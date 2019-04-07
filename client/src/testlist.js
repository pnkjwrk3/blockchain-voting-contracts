import React from 'react'
import ElectionContract from "./contracts/Election.json";
import Web3 from 'web3'



class TestListCandidates extends React.Component {
    state= {
        candidates:[],
        conadd:this.props.conadd
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
    
        } catch (error) {
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
      };



  render() {
    //const ReactTransitionGroup = React.addons.TransitionGroup;
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            {/* <th>Votes</th> */}
          </tr>
        </thead>
        <tbody >
          {this.state.candidates.map((candidate) => {
            return(
              <tr>
                <div style={{marginRight:'10px'}}><td>{candidate.id}</td></div>
                <td>{candidate.name}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default TestListCandidates

