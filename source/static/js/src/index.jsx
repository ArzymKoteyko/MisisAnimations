import React from 'react';
import ReactDOM from 'react-dom';
import { Fireworks } from 'fireworks-js/dist/react'
import { calc, point } from '@js-basics/vector';
const vector = point;


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

class Particle {
    constructor(pos, vel, acl, r, m) {
        this.pos = pos;
        this.vel = vel;
        this.acl = acl;
        this.r = r;
        this.m = m;
        this.lifeTime = 0;
    }
    calculateFriq() {
        let K = 0.05;
        let v = Math.sqrt((this.vel).dot(this.vel))
        let a = calc(() => -(Math.pow(v, 4/2) * K * this.vel.normalize()));
        return a;
    }
    calculateGravity(POS, M) {
        let G = 2000;
        let r = calc(() => POS - this.pos);
        let a = calc(() => G * (Math.sqrt(M / r.dot(r))) * r.normalize());
        return a; 
    }
    updateCords() {
        let POS = vector(500, 500);
        let M = 10;
        let af = this.calculateFriq();
        let ag = this.calculateGravity(POS, M);
        this.acl = calc(() => af + ag);
        this.vel = calc(() => this.vel + this.acl * 0.05);
        this.pos = calc(() => this.pos + this.vel); 
    }
}


class TouchParticleSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            particles: [],
        }
    }
    createParitcle = (event) => {   
        this.state.particles.push(new Particle(vector(event.clientX, event.clientY),
                                         vector(0, 3),
                                         vector(0,0),
                                         10,
                                         1));
        this.setState({
            particles: this.state.particles,
        })
    }
    updateParticles = () => {
        for (let i=0; i<this.state.particles.length; i++) {
            if (this.state.particles[i].lifeTime > 2000) {
                this.state.particles.splice(i,1);
            }
        }
        for (let particle of this.state.particles) {
            particle.lifeTime += 10;
            if (particle.lifeTime > 500) {
                
            }
            particle.updateCords();
        }
        this.setState({
            particles: this.state.particles,
        })
    }
    componentDidMount() {
        document.addEventListener('click', this.createParitcle);
        setInterval(() => {
            this.updateParticles();
        }, 10)
        setInterval(() => {
            console.log(this.state.particles.length)
        }, 500)
    }
    render () {
        let particleRenderer = this.state.particles.map(
            (particle) => <li><div style={{left:   particle.pos.x-particle.r,
                                           top:    particle.pos.y-particle.r,
                                           height: particle.r*2,
                                           width:  particle.r*2,}}>
                          </div></li>)
        return <ul>{particleRenderer}</ul>;
    }
}
ReactDOM.render(
    <TouchParticleSystem/>,
    document.getElementById('Circle')
)
