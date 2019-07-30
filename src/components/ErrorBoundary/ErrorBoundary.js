import React from 'react';

class ErrorBoundary extends React.Component {
    state = {
        error: false
    };

    componentDidCatch(error, info) {
        this.setState({error: true});
    }

    render() {
        if(this.state.error) {
            // FALLBACK ERROR DISPLAY
            let msg = 'Oops, Something went wrong!';
            if(this.props.errMsg)
                msg = this.props.errMsg;
            return <h2>{msg}</h2>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;