import React from 'react';
import ReactDOM from 'react-dom';
import { Fireworks } from 'fireworks-js/dist/react'



class ProgressBar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: 8800,
            cords: [0,0,0],
            speeds: [200, -573, 297],
            animate: true,
            complete: false,
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
            cords: [this.state.cords[0]+this.state.speeds[0],
                     this.state.cords[1]+this.state.speeds[1],
                     this.state.cords[2]+this.state.speeds[2]],
            progress: this.state.progress+50,
        })
    }

    // initialisation of animation
    initAnimation() {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'visible') {
                // remove start lag
                console.log('visivle')
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
                console.log('hidden')
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
        //this.socket = io('192.168.0.136:89')
        // read info
        //this.socket.on('click_count', (value) => {this.updateProgress(value)})
        // start animation
        this.initAnimation()
    }

    handleClick = () => {
        console.log('Yep');
        //this.push()
    }

    render () {
        this.wavestyles = [{},{},{}]
        for (let i=0; i<3; i++) {
            this.wavestyles[i] = {
                backgroundPosition: this.state.cords[i] + 'px -' + this.state.progress + 'px',
                transition: this.state.animate ? '2000ms linear' : 'none',
            }
        }

        this.progressBar = 
        <div className="ProgressBarWindow">
            <div className="ProgressBarBodyL1"
                style={this.wavestyles[0]}
            >
            <div className="ProgressBarBodyL2"
                style={this.wavestyles[1]}
            >
            <div className="ProgressBarBodyL3"
                style={this.wavestyles[2]}
            ></div></div></div>
        </div>

        this.button = 
        <div
            className="Button"
            onClick={this.handleClick}
        >Тык</div>

        const options = {
            speed: 3,
            particles: 200,
            explosion: 3,
            gravity: 2,
            friction: 0.97,
        }
        const style = {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
        }
        this.fireworks = 
        <Fireworks options={options} style={style}/>
        
        if (this.state.progress < 9350) {
            return (<>
                {this.progressBar}
                {this.button}
            </>)
        }
        else {
            return (<>
                {this.fireworks}
            </>)
        }
        
    }
}

ReactDOM.render(
    <ProgressBar
    />,
    document.getElementById('ProgressBar')
)

