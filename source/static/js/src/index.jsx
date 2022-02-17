import React from 'react';
import ReactDOM from 'react-dom';



class ProgressBar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            cordL1: 0,
            cordL2: 0,
            cordL3: 0,
            progress: 0,
            speedL1: 400,
            speedL2: -300,
            speedL3: 200,
            animate: true,
        }
    }

    push() {
        this.socket.emit('clicked')
    }
    updateProgress(value) {
        console.log(value)
        this.setState({
            progress: value*10,
        })
    }

    // running animation by moving bg layers from side to side
    updateCords() {
        this.setState({
            cordL1: this.state.cordL1+this.state.speedL1,
            cordL2: this.state.cordL2+this.state.speedL2,
            cordL3: this.state.cordL3+this.state.speedL3,
        })
    }

    // initialisation of animation
    initAnimation() {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'visible') {
                // remove start lag
                setTimeout( () => {
                    this.updateCords()
                }, 50)
                // starting to update back layers' positions
                this.timerID = setInterval( () => {
                    if (this.state.animate) {
                        this.updateCords()
                    }
                }, 2000)
                // enable animation
                this.setState({
                    animate: true,
                })
            } else {
                // stop updationg back layers
                clearInterval(this.timerID)
                // disable animation
                this.setState({
                    animate: false,
            })
            }
        }); 
        // removing the exat first lag
        setTimeout( () => {
            this.updateCords()
        }, 100)
        // the exat first interval
        this.timerID = setInterval( () => {
            if (this.state.animate) {
                this.updateCords()
            }
        }, 2000)
    }

    componentDidMount() {
        // mount web socket
        this.socket = io('192.168.0.136:89')
        // read info
        this.socket.on('click_count', (value) => {this.updateProgress(value)})
        // start animation
        this.initAnimation()
    }

    handleClick = () => {
        console.log('Yep');
        this.push()
    }

    render () {
        this.s1 = {
            backgroundPosition: this.state.cordL1+'px -' + this.state.progress+'px',
            transition: this.state.animate ? '2000ms linear' : 'none',
        }
        this.s2 = {
            backgroundPosition: this.state.cordL2+'px -' + this.state.progress+'px',
            transition: this.state.animate ? '2000ms linear' : 'none',
        }
        this.s3 = {
            backgroundPosition: this.state.cordL3+'px -' + this.state.progress+'px',
            transition: this.state.animate ? '2000ms linear' : 'none',
        }
        return (<>
        <div className="ProgressBarBodyL1"
            style={this.s1}
        >
        <div className="ProgressBarBodyL2"
            style={this.s2}
        >
        <div className="ProgressBarBodyL3"
            style={this.s3}
        ></div></div></div>
        <div
            className="Button"
            onClick={this.handleClick}
        >Тык</div>
        </>)
    }
}

ReactDOM.render(
    <ProgressBar
    />,
    document.getElementById('ProgressBar')
)