var raycaster = new THREE.Raycaster();
var hoverObject;
var selectedBody;
var isBodySelected = false;
var selectedInt = 0;

var mouse = new THREE.Vector2();

function orbitPath(r) {
// make a line to represent the orbit path of each planet
    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x777777,
    });

    var lineGeometry = new THREE.CircleGeometry(r, 128);
    lineGeometry.vertices.shift();
    lineGeometry.computeBoundingSphere();

    var line = new THREE.LineLoop(lineGeometry, lineMaterial);
    line.rotation.x = Math.PI / 2;

    return line;
}

var torusGroup = new THREE.Group();
torusGroup.name = "RaycastRings";

function orbitTorus(){
    // make a torus for each planet's orbital path and add it to the torus group
    for(var i =1; i<solarSystem.children.length;i++){
        var r2 = solarSystem.children[i].position.distanceTo(solarSystem.children[0].position);
        var r1 = 0;
        if(i>1){
            r1 = solarSystem.children[i-1].position.distanceTo(solarSystem.children[0].position);
        }
        var r  = (r1+r2)/2;
        var t = (r2-r1)/2;
        var g = new THREE.TorusGeometry( r, t, 2, 50, 2*Math.PI);
        var m = new THREE.MeshBasicMaterial();
        m.color = new THREE.Color( ((i+1)/solarSystem.children.length),0,0.5 );
        m.opacity = 0; // make default 0, set to 1 or so on raycast hit
        m.transparent = true;
		m.alphaTest = 0.5;
        
        var tor_subgroup = new THREE.Group();
        var tor = new THREE.Mesh(g,m);
        tor.layers.enable(2);
        tor.rotation.x = Math.PI/2;
        tor_subgroup.add(tor);
        tor_subgroup.add(orbitPath(r2));
        torusGroup.add(tor_subgroup);
    }
    scene.add(torusGroup);
}

function onMouseMove(event){
    // keep track of mouse position in window
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function rayCast(){
    // cast a ray from the camera in the direciton of the mouse position each frame
    // if it hit a torus, make it opaque and consider it being hovered over
    // if moving away from a torus, make it transparent
    raycaster.setFromCamera(mouse,camera);
    var intersect = raycaster.intersectObjects(scene.children[1].children, true);
    if(intersect.length>0){
        if(hoverObject!=intersect[0].object){
            if(hoverObject){
                hoverObject.material.opacity=0;
            }
            hoverObject = intersect[0].object;
            hoverObject.material.opacity = 0.5;
        }
    }
    else{
        if(hoverObject) {hoverObject.material.opacity = 0;}
        hoverObject = null;
    }
}

function onDocumentMouseDown(event){
    // if a torus is being hovered over and the mouse is clicked,
    // find the index of the selected torus in the group
    // and select the corresponding planet to zoom towards
    if(hoverObject&&!isBodySelected){
        for(var i=0;i<torusGroup.children.length;i++){
            if(torusGroup.children[i].children[0]==hoverObject){
                selectedInt = i+1;
                selectedBody = solarSystem.children[1+i];
                zoom();
            }
        }
    }
}
