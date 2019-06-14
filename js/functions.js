var numOfPlanets;
var currentNumOfPlanets;

//Return a populated Solar System group.
var genSolarSystem = function(numPlanets, colour) {
    var solarSystem = new THREE.Group();
    numOfPlanets = numPlanets
    
    //Add the Sun.
    var sun = new THREE.Group();
    sun.name = "Sun";
    sun.add(genBody(THREE.Math.randFloat(200, 500), colour, colour));
    solarSystem.add(
        sun
    );
    
    //Add the planets.
    while (solarSystem.children.length < numPlanets + 1) {
        solarSystem.add(genPlanetSystem(1 + THREE.Math.randInt(0, 3)));
        currentNumOfPlanets = solarSystem.children.length;
    }

    return solarSystem;
}

//Return a populated Planet System group.
var genPlanetSystem = function(numBodies) {
    var planetSystem = new THREE.Group();

    var minPlanetSize = 20;
    var maxPlanetSize = 100;
    var planetSize = THREE.Math.randFloat(20, 100);
    
    //Add a planet, the middle planet is Earth-like.
    if(currentNumOfPlanets == Math.floor(numOfPlanets / 2)) {
        planetSystem.add(
            genBody(planetSize, 0x44ff44, 0x000000, true)
        );
    } else {
        planetSystem.add(
            genBody(planetSize, randColor(), 0x000000, false)
        );
    }
    

    var minMoonSize = planetSystem.children[0].children[0].geometry.boundingSphere.radius / 20;
    var maxMoonSize = planetSystem.children[0].children[0].geometry.boundingSphere.radius / 5;
    
    //Add moons to the planet.
    while (planetSystem.children.length < numBodies) {
        planetSystem.add(
            genBody(THREE.Math.randFloat(minMoonSize, maxMoonSize), randColor(), false)
        );
    }
    
    //If there are no moons, add a ring.
    if (numBodies == 1) {
        var r1 = THREE.Math.randFloat(planetSize * 2, planetSize * 6);
        var r2 = THREE.Math.randFloat(planetSize * 2, planetSize * 6);
        if (r1 > r2) planetSystem.add(genRing(100 * r1 - r2, r1, r2));
        else planetSystem.add(genRing(100 * r2 - r1, r2, r1));
    }
    return planetSystem;
}

//Return a populated Body group.
var genBody = function(size, color, emission, water) {
    var body = new THREE.Group();
    if(emission == 0x000000){
        body = genPlanet(size, water, color);
    } else {
        body.add(generateSun(size));
        body.name = "Sun Body";
    }
    body.children[0].geometry.computeBoundingSphere();
    body.children[0].geometry.boundingSphere.radius = size;
    
    return body;
}

//Return a populated Ring group, similar to a Body group.
var genRing = function(particleCount, particleRange, exclusionRange) {
    var ring = new THREE.Group();

    var ringMaterial = new THREE.PointsMaterial({
        color: randColor(),
        size: 5
    });

    var ringGeometry = new THREE.Geometry();
    for (var p = 0; p < particleCount; p++) {
        var pos = new THREE.Vector3(0, 0, 0);
        while (new THREE.Vector3(0, 0, 0).distanceTo(pos) < exclusionRange || new THREE.Vector3(0, 0, 0).distanceTo(pos) > particleRange) {
            pos.x = Math.random() * (2 * particleRange) - particleRange;
            pos.y = 0;
            pos.z = Math.random() * (2 * particleRange) - particleRange;
        }
        ringGeometry.vertices.push(pos);
    }

    ring.add(new THREE.Points(ringGeometry, ringMaterial));
    ring.children[0].geometry.computeBoundingSphere();

    return ring;
}

//Return a Points mesh for the starfield.
var genStars = function(particleCount, particleRange, exclusionRange) {
    var starfieldMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 5
    });
    
    //Randomize the position of each vertex in three dimensions.
    var starfieldGeometry = new THREE.Geometry();
    for (var p = 0; p < particleCount; p++) {
        var pos = new THREE.Vector3(0, 0, 0);
        while (new THREE.Vector3(0, 0, 0).distanceTo(pos) < exclusionRange || new THREE.Vector3(0, 0, 0).distanceTo(pos) > particleRange) {
            pos.x = Math.random() * (2 * particleRange) - particleRange;
            pos.y = Math.random() * (2 * particleRange) - particleRange;
            pos.z = Math.random() * (2 * particleRange) - particleRange;
        }
        starfieldGeometry.vertices.push(pos);
    }

    var starfield = new THREE.Points(starfieldGeometry, starfieldMaterial);

    return starfield;
}

//This function moves the positions of all of the groups.
var positionBodies = function() {
    //Minimum and maximum shift values.
    var minBodyShift = 10;
    var maxBodyShift = 100;
    var minSystemShift = 100;
    var maxSystemShift = 1000;
    
    //Iterate through each Planet System.
    for (let i = 1; i < solarSystem.children.length; i++) {
        //Iterate through each body in the planet system and space them out.
        
        for (let j = 1; j < solarSystem.children[i].children.length; j++) {
            //Translate it to the position of the previous body.
            solarSystem.children[i].children[j].position.x += solarSystem.children[i].children[j - 1].position.x;
            //Translate it by the radius of the previous body. 
            solarSystem.children[i].children[j].position.x += solarSystem.children[i].children[j - 1].children[0].geometry.boundingSphere.radius;
            //Translate it by the radius of itself.
            solarSystem.children[i].children[j].position.x += solarSystem.children[i].children[j].children[0].geometry.boundingSphere.radius;
            //Translate it a random distance further.
            solarSystem.children[i].children[j].position.x += THREE.Math.randFloat(minBodyShift, maxBodyShift);
            //If the body is a ring, return it to the local origin.
            if (solarSystem.children[i].children[j].children[0].isPoints == true) {
                solarSystem.children[i].children[j].position.x = 0.000001; //Ring would not render at 0, 0, 0, unknown reason.
            }
        }

        //Space out each planet system.
        
        //Translate it by the position of the previous Planet System.
        solarSystem.children[i].position.x += solarSystem.children[i - 1].position.x;
        //Translate it by the radius of the previous Planet System.
        solarSystem.children[i].position.x += solarSystem.children[i - 1].children[solarSystem.children[i - 1].children.length - 1].position.x + solarSystem.children[i - 1].children[solarSystem.children[i - 1].children.length - 1].children[0].geometry.boundingSphere.radius;
        //Translate it by the radius of itself.
        solarSystem.children[i].position.x += solarSystem.children[i].children[solarSystem.children[i].children.length - 1].position.x + solarSystem.children[i].children[solarSystem.children[i].children.length - 1].children[0].geometry.boundingSphere.radius;
        //Move it a random distance further.
        solarSystem.children[i].position.x += THREE.Math.randFloat(minSystemShift, maxSystemShift);
    }
}

//Rotates the children of parentGroup around the respective local origin.
var orbit = function(parentGroup) {
    for (let i = 1; i < parentGroup.children.length; i++) {
        var radius = parentGroup.children[i].position.distanceTo(new THREE.Vector3(0, 0, 0));
        parentGroup.children[i].position.set(
            radius * Math.cos(time / (radius)),
            0,
            radius * Math.sin(time / (radius))
        );
    }
}

//Spin each Body group on its own axis as a function of its radius. 
var spin = function() {
    for (let i = 1; i < solarSystem.children.length; i++) {
        for (let j = 0; j < solarSystem.children[i].children.length; j++) {
          solarSystem.children[i].children[j].rotation.y = (time / solarSystem.children[i].children[j].children[0].geometry.boundingSphere.radius) * 0.001;
        }
    }
}

//Return a random colour.
var randColor = function() {
    return new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
    );
}

//Return a random colour interpolated between two colours.
var lerpColour = function(a, b, t) {
    console.log(a.r + ", " + a.g + ", " + a.b + " : " + b.r + ", " + b.g + ", " + b.b + " : " + t);
    return new THREE.Color(
        a.r + (b.r - a.r) * t,
        a.g + (b.g - a.g) * t,
        a.b + (b.b - a.b) * t,
        a.a + (b.a - a.a) * t
    );
}

//Return a random colour interpolated between two adjacent colours in an array.
var lerpColours = function(colours) {
    var t = THREE.Math.randFloat(0, colours.length - 1);
    var i = t;
    while (i > 1) {
        i--;
    }
    return lerpColour(colours[Math.floor(t)], colours[Math.ceil(t)], i);

}

//Keyboard controls that manage the time scale.
var onKeyDown = function(event) {
    var step = timeScaleRange / 100;
    switch(event.keyCode) {
        case 87:
            timeScale += step;
            break;
        case 83:
            timeScale -= step;
            break;
        case 32:
            paused ^= true;
            break;
        case 13:
            zoomOut();
            break;
    }
    if (timeScale > timeScaleRange) { timeScale = timeScaleRange; }
    if (timeScale < -timeScaleRange) { timeScale = -timeScaleRange; }
}

//Basic resize function.
var Resize = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height);
    renderer.render(scene,camera);
}

var Update = function() {
    requestAnimationFrame(Update);
    var delta = clock.getDelta();
    if (!paused) time += delta * timeScale;
    orbit(solarSystem);

    time += 1 * 0.1; 
    
    for (let i = 1; i < solarSystem.children.length; i++) {
        for (let x = 0; x < solarSystem.children[i].children.length; x++) {
            var planetGroup = solarSystem.children[i].children[x];
            if (typeof planetGroup.animate == "function"){
                planetGroup.animate(time);
            }
        }
        orbit(solarSystem.children[i]);
    }
    solarSystem.children[0].children[0].children[0].animate(delta * timeScale);
    spin();

    cameraFollow();

    controls.update();



    rayCast();

    renderer.render(scene, camera);
    //composer.render();
}
