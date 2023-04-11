import React, {Component} from 'react'

class LoginClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'hello guys'
        }
    }

    render() {
        return(
            <div>
                <h1>{this.state.message}</h1>
                <button onClick={() => this.setState({message:'Login Successfully'})}>Login</button>
            </div>
        )
    }
}

export default LoginClass()