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

var icosahedron = new THREE.IcosahedronGeometry(300, 2);

var vertexShader = fs.readFileSync(__dirname + '/../shaders/vertex/asteroid.glsl');
var pixelShader = fs.readFileSync(__dirname + '/../shaders/pixel/asteroid.glsl');

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
                albedo: { type: 'f', value: this.props.albedo },
                light: { type: 'v3', value: this.props.light }
            },
            vertexShader: vertexShader,
            fragmentShader: pixelShader
        });
        return React.createElement(ReactTHREE.Mesh, asteroidProps);
    }
});

var plane = new THREE.PlaneGeometry(1200, 1200); 

var Floor = React.createClass({
    displayName: 'Floor',
    render: function () {
        var floorProps = _.clone(this.props);
        floorProps.geometry = plane;
        floorProps.material = new THREE.ShaderMaterial({
            uniforms: {
                albedo: { type: 'f', value: 0.9 },
                light: { type: 'v3', value: this.props.light }
            },
            vertexShader: vertexShader,
            fragmentShader: pixelShader
        });
        return React.createElement(ReactTHREE.Mesh, floorProps);
    }
});

var theCamera;

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
        position: this.props.cameraPosition,
        lookat: new THREE.Vector3(0,0,0)
      }
    );

    theCamera = MainCameraElement;

    asteroids = _.map(this.props.asteroids, function (d) {
        return React.createElement(Asteroid, d);
    });

    return React.createElement(
      ReactTHREE.Scene,
      {width:this.props.width, height:this.props.height, camera:'maincamera'},
      MainCameraElement,
      React.createElement(Floor, {
        light: light,
        position: new THREE.Vector3(0, 0, -800)
      }),
      asteroids
    );
  }
});

var VectorDisplay = React.createClass({
    displayName: 'VectorDisplay',
    render: function () {
        return React.createElement(
            'div',
            { className: 'vector' },
            this.props.vector
        );
    }
});

var light = new THREE.Vector3(350, 300, 0);

var sceneProps = {
    width: window.innerWidth - 32,
    height: window.innerHeight - 64,
    cameraPosition: new THREE.Vector3(600, 0, 0),
    asteroids: [
      {
        position: new THREE.Vector3(0, 0, -300),
        quaternion: new THREE.Quaternion(),
        albedo: 0.4,
        light: light
      },
      {
        position: new THREE.Vector3(0, 0, 300),
        quaternion: new THREE.Quaternion(),
        albedo: 0.9,
        light: light
      },

    ]
};

var r = React.render(
    React.createElement('div', {}, 
        React.createElement(VectorDisplay, { vector: sceneProps.cameraPosition}),
        
        React.createElement(ExampleScene, sceneProps)
    ),
    document.body
);

var angle = 0;

function spinRoid (t) {
    angle = t * 0.001;
    // sceneProps.asteroidData.quaternion.setFromEuler(new THREE.Euler(angle, 2 * angle, 0));
    r.setProps(sceneProps);

    requestAnimationFrame(spinRoid);
};

spinRoid();

var mouseDown = false;
var mouseLocation = [0, 0];

window.onmousedown = function (event) {
    mouseDown = true;
};

window.onmouseup = function (event) {
    mouseDown = false;
};

window.onmousemove = function (event) {
    var delta = [
        event.clientX - mouseLocation[0],
        event.clientY - mouseLocation[1],
    ];
    if (mouseDown) {
        var quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(
            new THREE.Euler(0, -1, 0), delta[0] / 200
        );
        sceneProps.cameraPosition.applyQuaternion(quaternion);
        quaternion.setFromAxisAngle(
            new THREE.Euler(0, 0, 1), delta[1] / 200
        );
        sceneProps.cameraPosition.applyQuaternion(quaternion);
    }
    mouseLocation = [event.clientX, event.clientY];
    r.setProps(sceneProps);
    theCamera.updateProjectionMatrix;
};

window.onwheel = function (event) {
    
    sceneProps.cameraPosition.multiplyScalar(1 + (event.deltaY / 100));
    r.setProps(sceneProps);
    theCamera.updateProjectionMatrix;
};
