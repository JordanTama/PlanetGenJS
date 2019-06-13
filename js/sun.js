var generateSun = function(size){
    var sunSurfaceTex = new THREE.TextureLoader().load("textures/sunSurfaceMaterial.jpg", function(){
        console.log("Loaded successfully.");
    }, undefined, function(err){
        console.error(err);
    });
    var sunAtmosTex = new THREE.TextureLoader().load("textures/sunAtmosphereMaterial.png", function(){
        console.log("Loaded successfully.");
    }, undefined, function(err){
        console.error(err);
    });

    var sunMaterial = new THREE.ShaderMaterial({
        fragmentShader: 'uniform float time;\n' +
            'uniform sampler2D texture1;\n' +
            'uniform sampler2D texture2;\n' +
            'varying vec2 texCoord;\n' +
            'void main( void ) {\n' +
            '   vec4 noise = texture2D( texture1, texCoord );\n' +
            '   vec2 T1 = texCoord + vec2( 1.5, -1.5 ) * time  * 0.01;\n' +
            '   vec2 T2 = texCoord + vec2( -0.5, 2.0 ) * time *  0.01;\n' +
            '   T1.x -= noise.r * 2.0;\n' +
            '   T1.y += noise.g * 4.0;\n' +
            '   T2.x += noise.g * 0.2;\n' +
            '   T2.y += noise.b * 0.2;\n' +
            '   float p = texture2D( texture1, T1 * 2.0 ).a + 0.25;\n' +
            '   vec4 color = texture2D( texture2, T2 );\n' +
            '   vec4 temp = color * 2.0 * ( vec4( p, p, p, p ) ) + ( color * color );\n' +
            '   gl_FragColor = temp;\n' +
            '}',
        vertexShader: 'varying vec2 texCoord;\n' +
            'void main() {\n' +
            '	texCoord = uv;\n' +
            '	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n' +
            '	gl_Position = projectionMatrix * mvPosition;\n' +
            '}',
    });
    
    var uniforms = {
        "texture1": {
            type: "t",
            value: sunAtmosTex
        },
        "texture2": {
            type: "t",
            value: sunSurfaceTex
        },
        "time": {
            value: 1.0,
        }
    }
    
    uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
    uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;

    sunMaterial.uniforms = uniforms;

    var sun = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), sunMaterial);
    sun.name = "Sun Mesh";
    sun.animate = function(delta){
        uniforms["time"].value += 0.02 * delta;
    }
    
    return sun;
}


