var raycaster = new THREE.Raycaster();
var hoverObject;
var selectedBody;
var isBodySelected = false;

var mouse = new THREE.Vector2();

function orbitPath(r) {

    // MATERIAL
    var lineMaterial = new THREE.LineBasicMaterial({
        // color: 0x333333,
        color: 0x777777,
    });

    // GEOMETRY
    var lineGeometry = new THREE.CircleGeometry(r, 128);
    lineGeometry.vertices.shift();
    lineGeometry.computeBoundingSphere();

    // OBJECT
    var line = new THREE.LineLoop(lineGeometry, lineMaterial);
    line.rotation.x = Math.PI / 2;

    return line;

}

var torusGroup = new THREE.Group();
torusGroup.name = "RaycastRings";

function orbitTorus(){
    for(var i =1; i<solarSystem.children.length;i++){
        // var r2 = paths[i].geometry.boundingSphere.radius;
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
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function rayCast(){
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
    if(hoverObject){
        for(var i=0;i<torusGroup.children.length;i++){
            if(torusGroup.children[i].children[0]==hoverObject){
                if(isBodySelected){
                    // selectedBody.children[0].children[0].material.emissive.setHex(0x000000);
                }
                selectedBody = solarSystem.children[1+i];
                isBodySelected = true;
                // selectedBody.children[0].children[0].material.emissive.setHex(0xFFFFFF);
                zoom();
                // console.log(selectedBody.children[0].children[0].geometry.boundingSphere.radius);
            }
        }
    }
    else{
        if(selectedBody){
           // selectedBody.children[0].children[0].material.emissive.setHex(0x000000);
        }
        selectedBody = null;
        isBodySelected = false;

        zoomOut();

    }
}
