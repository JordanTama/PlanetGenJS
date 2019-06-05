var zoomSpeed = 3;
var lockedOn = false;
var offsetLength;

function zoom(){
	if(!TweenMax.isTweening(initial)) {
		var initial = camera.position;
		if(selectedBody){
			var objectCentre = selectedBody.position;
			var direction = new THREE.Vector3(objectCentre.x,objectCentre.y,objectCentre.z);
			direction.sub(initial);
			var normDirection = new THREE.Vector3();
			normDirection = direction.normalize();
			var radius = selectedBody.children[0].children[0].geometry.boundingSphere.radius;
			var offset = new THREE.Vector3();
            offset = normDirection.multiplyScalar(radius).multiplyScalar(10);
            var offsetPoint = new THREE.Vector3(objectCentre.x,objectCentre.y,objectCentre.z).sub(offset);
            offsetLength = radius*10;
            this.tl = new TimelineMax();
            this.tl.to(initial, zoomSpeed, {x:offsetPoint.x,y:offsetPoint.y,z:offsetPoint.z, ease: Expo.easeOut});
			// camera.lookAt(selectedBody.position);
			controls.target = selectedBody.position;
			lockedOn = true;

		}
	}
}

function zoomOut(){
	this.tl = new TimelineMax();
    this.tl.to(camera.position, zoomSpeed, {x:initialCamPos.x,y:initialCamPos.y,z:initialCamPos.z, ease: Expo.easeOut});
	controls.target = solarSystem.children[0].position;
	lockedOn = false;
}

function cameraFollow(){
	if(selectedBody && lockedOn){
        controls.enablePan = false;
        controls.enableZoom = true;
        selectedBody.getWorldPosition( controls.target );

        
		var direction = new THREE.Vector3( );
		direction.subVectors( camera.position, controls.target );
		direction.normalize().multiplyScalar( offsetLength );
		camera.position.copy(direction.add( controls.target ));
    }
    else{
        controls.enablePan = true;
        controls.target = solarSystem.children[0].position;
    }
}