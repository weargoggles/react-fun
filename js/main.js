var React = require('react');
var Dispatcher = require('flux').Dispatcher;
var dispatcher = new Dispatcher();
var ReactTHREE = require('react-three');
var THREE = require('three');
var fs = require('fs');
var _ = require('underscore');

keys = {};

dispatcher.register(function(payload) {
    if (payload.actionType === 'keydown') {
        keys[payload.event.keyCode] = true;
        console.log(keys);
    }
    else if (payload.actionType === 'keyup') {
        delete keys[payload.event.keyCode];
        console.log(keys);
    }
});

window.onkeydown = function (event) {
    dispatcher.dispatch({
        actionType: 'keydown',
        event: event,
    });
};

window.onkeyup = function (event) {
    dispatcher.dispatch({
        actionType: 'keyup',
        event: event,
    });
};

var icosahedron = new THREE.IcosahedronGeometry(100);

var Asteroid = React.createClass({
    displayName: 'Asteroid',
    propTypes: {
        albedo: React.PropTypes.number.isRequired,
        position: React.PropTypes.instanceOf(THREE.Vector3),
        quaternion: React.PropTypes.instanceOf(THREE.Quaternion)
    },
    render: function () {
        var asteroidProps = _.clone(this.props);
        asteroidProps.geometry = icosahedron;
        asteroidProps.material = new THREE.ShaderMaterial({
            uniforms: {
                albedo: { type: 'f', value: this.props.albedo }
            },
            vertexShader: fs.readFileSync(__dirname + '/../shaders/vertex/asteroid.glsl'),
            fragmentShader: fs.readFileSync(__dirname + '/../shaders/pixel/asteroid.glsl'),
        });
        return React.createElement(ReactTHREE.Mesh, asteroidProps);
    }
});

var ExampleScene = React.createClass({
  displayName: 'ExampleScene',
  render: function() {
    var MainCameraElement = React.createElement(
      ReactTHREE.PerspectiveCamera,
      { 
        name:'maincamera',
        fov:'75',
        aspect: this.props.width / this.props.height,
        near: 1,
        far:5000,
        position: new THREE.Vector3(0,0,600),
        lookat: new THREE.Vector3(0,0,0)
      }
    );

    return React.createElement(
      ReactTHREE.Scene,
      {width:this.props.width, height:this.props.height, camera:'maincamera'},
      MainCameraElement,
      React.createElement(Asteroid, this.props.asteroidData)
    );
  }
});

var sceneProps = {
    width: window.innerWidth - 6,
    height: window.innerHeight - 6,
    asteroidData: {
        position: new THREE.Vector3(0, 0, 0),
        quaternion: new THREE.Quaternion(),
        albedo: 1.0
    }
};

var r = React.render(
    React.createElement(ExampleScene, sceneProps),
    document.body
);

var angle = 0;

function spinRoid (t) {
    angle = t * 0.001;
    sceneProps.asteroidData.quaternion.setFromEuler(new THREE.Euler(angle, 2 * angle, 0));
    r.setProps(sceneProps);

    requestAnimationFrame(spinRoid);
};

spinRoid();
