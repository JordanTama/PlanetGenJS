var simplex = new SimplexNoise();
    
var genOcean = function(){
	delta = 0;
	var geometry = new THREE.IcosahedronGeometry(1, 5);
	var waterMat = new THREE.MeshStandardMaterial({
	   flatShading: true,
	   color: new THREE.Color(0.2,0.2,1.0),
	   transparent: true,
	   opacity: 0.85,
	   roughness: 0.4 
	});
	var ocean = new THREE.Mesh(geometry, waterMat);
	ocean.castShadow = true;
	ocean.receiveShadow = true;

	ocean.animate = function(){
		for (var i = 0; i < geometry.vertices.length; i++)
		{
			var vert_pos_x = geometry.vertices[i].x * 5;
			var vert_pos_y = geometry.vertices[i].y * 5;
			var vert_pos_z = geometry.vertices[i].z * 5;
			var dir = new THREE.Vector3(0,0,0);

			//Get the direction of the vertex
			dir.sub(new THREE.Vector3(vert_pos_x, vert_pos_y, vert_pos_z));

			var step = delta * 0.025
			var vert_noise = simplex.noise3D(
				(vert_pos_x + step) * 1,
				(vert_pos_y + step) * 1,
				(vert_pos_z + step) * 1
			);
			geometry.vertices[i].setLength(1.025 + vert_noise * 0.007);
		}
		geometry.verticesNeedUpdate = true;
	}
	return ocean;
}

var genPlanetTerrain = function(color){
	var seed = THREE.Math.randInt(-9999,9999);

	var geometry = new THREE.IcosahedronGeometry(1, 4);

	var terrain_mat = new THREE.MeshStandardMaterial({
		color: color,
		roughness: 0.8,
		flatShading: true,
	});

	//Create the noise, then loop through all the vertices
	for (var i = 0; i < geometry.vertices.length; i++)
	{
		var vert_pos_x = geometry.vertices[i].x;
		var vert_pos_y = geometry.vertices[i].y;
		var vert_pos_z = geometry.vertices[i].z;
		var dir = new THREE.Vector3(0,0,0);

		//Get the direction of the vertex
		dir.sub(new THREE.Vector3(vert_pos_x, vert_pos_y, vert_pos_z));

		var vert_noise = simplex.noise3D(vert_pos_x + seed, vert_pos_y + seed, vert_pos_z + seed);
		
		if(vert_noise > .75){
			geometry.vertices[i].addScaledVector(dir, vert_noise * -0.175);
		} else if(vert_noise > .4){
			geometry.vertices[i].addScaledVector(dir, vert_noise * -0.16);
		} else if(vert_noise > .1){
			geometry.vertices[i].addScaledVector(dir, vert_noise * -0.15);
		}else {
			geometry.vertices[i].addScaledVector(dir, vert_noise * -0);
		}
	}
	var planet = new THREE.Mesh(geometry, terrain_mat);

	return planet;
}

function genPlanet(size, water, color){
	var waterEnabled = water;
	var group = new THREE.Group();
	group.name = "Planet Group";
	var planet = genPlanetTerrain(color);
	planet.name = "Planet";
	planet.scale.set(size, size, size);
	group.add(planet);
	
	if(water == true){
		var ocean = genOcean()
		ocean.name = "Ocean";
		ocean.scale.set(size, size, size);
		group.add(ocean);

		group.animate = function(){
			ocean.animate();
		}
		timer = 0;
	}
	
	return group;
}
