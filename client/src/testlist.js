import React from 'react'

class TestListCandidates extends React.Component {
    state= {
        candidates:[],
        //conadd:this.props.conadd
    }
    
    componentDidMount = async () => {
          this.props.state.MyContract.methods.candidatesCount().call().then((candidatesCount) => {
            for (var i = 1; i <= candidatesCount; i++) {
              this.props.state.MyContract.methods.candidates(i).call().then((candidate) => {
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
      };

  render() {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody >
          {this.state.candidates.map((candidate) => {
            return(              
                <tr>                  
                  <td><div style={{marginRight:'10px'}}>{candidate.id}</div></td>
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

