import React from 'react';
import ReactDOM from 'react-dom';
import { Fireworks } from 'fireworks-js/dist/react'



class ProgressBar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: 48,
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
            progress: this.state.progress+0.2,
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
        //// mount web socket
        ////this.socket = io('192.168.0.136:89')
        //// read info
        ////this.socket.on('click_count', (value) => {this.updateProgress(value)})
        //// start animation
        this.initAnimation()
    }

    handleClick = () => {
        console.log('Yep');
        ////this.push()
    }

    render () {
        this.wavestyles = [{},{},{}]
        for (let i=0; i<3; i++) {
            this.wavestyles[i] = {
                backgroundPosition: this.state.cords[i] + 'px ' + this.state.progress + '%',
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

class TouchParticle extends React.Component {
    constructor (props) {
        super(props);
        this.radius = 10;
        this.state = {
            x: props.x,
            y: props.y,
            vx: 0,
            vy: 3,
            r: this.radius,
            m: 1,
        };
    }
    findDistSqred = (x1, y1, x2, y2) => {
        return Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
    }
    calculateFriq = (vx, vy) => {
        let k = 0.01;
        let vSqred = this.findDistSqred(0, 0, vx, vy);
        let v = Math.pow(vSqred, 0.5);
        let a = -(Math.pow(v, 3) * k);
        let cosa = vx / v;
        let sina = vy / v;
        return {'x': cosa * a, 'y': sina * a}
    }
    calculateGravity = (x1, y1, m1, x2, y2, m2) => {
        let G = 1000;
        let distSqred = this.findDistSqred(x1, y1, x2, y2);
        let dist = Math.pow(distSqred, 0.5);
        let a = G * Math.pow( (m2 / (distSqred * m1)), 0.5);
        let cosa = (x2 - x1) / dist;
        let sina = (y2 - y1) / dist;
        return {'x': cosa * a, 'y': sina * a};
    }
    updateCords = () => {
        let X = 500;
        let Y = 500;
        let M = 10;
        let ag = this.calculateGravity(this.state.x, this.state.y, this.state.m, X, Y, M);
        let af = this.calculateFriq(this.state.vx, this.state.vy);
        let dvx = (ag['x'] + af['x']) * 0.05;
        let dvy = (ag['y'] + af['y']) * 0.05;
        this.setState({
            vx: this.state.vx + dvx,
            vy: this.state.vy + dvy,
            x: this.state.x + this.state.vx,
            y: this.state.y + this.state.vy,
        });
    }
    componentDidMount () {
        setTimeout( ()=>{
            this.setState({y: this.state.y - 200})
            setInterval(this.updateCords, 10);
        }, 510);
    }
    render () {
        this.style = {
            height: this.state.r*2,
            width: this.state.r*2,
            left: this.state.x-this.state.r,
            top: this.state.y-this.state.r,
        }
        return (
            <div style={this.style}></div>
        )
    }
}

let circles = []
function printCord(event) {
    let circle = <TouchParticle x={event.clientX} y={event.clientY}/>
    circles.push(circle)
    let circlesRenderer = circles.map((circle) => <li>{circle}</li>)
    ReactDOM.render(
        <ul>{circlesRenderer}</ul>,
        document.getElementById('Circle')
    )
    
    console.log(event.clientX, event.clientY)
}
document.addEventListener('click', printCord)