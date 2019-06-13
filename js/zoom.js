var zoomSpeed = 2;
var lockedOn = false;
var zooming = false;
var offsetLength;

function zoom(){
	// zoom into a planet if you are not currently orbiting one, or zooming towards one
	if(!TweenMax.isTweening(camera.position)&&!zooming&&!isBodySelected) {
		var initial = camera.position;
		if(selectedBody){
			controls.target = selectedBody.position;
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
			lockedOn = true;
			zooming = true;
			isBodySelected = true;
		}
	}
}

function zoomOut(){
	// zoom out from a planet you are locked onto and move the camera back to its initial position
	this.tl = new TimelineMax();
    this.tl.to(camera.position, zoomSpeed, {x:initialCamPos.x,y:initialCamPos.y,z:initialCamPos.z, ease: Expo.easeOut});
	controls.target = new THREE.Vector3(solarSystem.children[0].position.x, solarSystem.children[0].position.y, solarSystem.children[0].position.z) ;
	lockedOn = false;
	zooming = true;
	selectedBody = null;
	isBodySelected = false;
	selectedInt = 0;
}

function cameraFollow(){
	// Clear text and pause movement while zooming to planet
	if(TweenMax.isTweening(camera.position) && !paused && zooming){
		paused = true;
		clearText();
	}

	// once arrived, unpause the planets and set the text for that planet
	else if(!TweenMax.isTweening(camera.position) && paused && zooming){
		paused = false;
		zooming = false;
		setText(selectedInt);
	}

	// console.log("selected: "+isBodySelected);
	// console.log("zooming: "+zooming);
	// console.log("intSel: "+selectedInt);

	// once at a planet, lock the camera to an offset position away from the planet
	// lock out user controls as well
	if(selectedBody && lockedOn && !TweenMax.isTweening(camera.position)){
        controls.enablePan = false;
        controls.enableZoom = true;
        selectedBody.getWorldPosition( controls.target );

		var direction = new THREE.Vector3( );
		direction.subVectors( camera.position, controls.target );
		direction.normalize().multiplyScalar( offsetLength );
		camera.position.copy(direction.add( controls.target ));
    }
}