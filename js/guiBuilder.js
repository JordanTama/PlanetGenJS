function buildGui() {
    gui = new dat.GUI();
    var params = {
    Sun_Color: solarSystem.children[0].children[0].children[0].material.color.getHex(),
    Sun_Pointlight_Intensity: pointLight.intensity,
    Sun_AmbientLight_Intensity: ambientLight.intensity,
    Sun_AmbientLight_Color: ambientLight.color.getHex(),

    Stars_Num: starfield.geometry.vertices.length,
    
    Planets_Num: numOfPlanets,
    Planets_Timescale: timeScale
    }

    var sunGUI = gui.addFolder('Sun');
    var starsGUI = gui.addFolder('Stars');
    var planetsGUI = gui.addFolder('Planets');

    sunGUI.addColor( params, 'Sun_Color' ).onChange( function ( val ) {
        solarSystem.children[0].children[0].children[0].material.color.setHex(val);
        solarSystem.children[0].children[0].children[0].material.emissive.setHex(val);
        pointLight.color.setHex( val );
        } );

    sunGUI.add( params, 'Sun_Pointlight_Intensity',  { Off: 0, Dim: 1, Default: 3, Bright: 10 }).onChange( function ( val ) {
      pointLight.intensity = val;
    } );

    sunGUI.addColor( params, 'Sun_AmbientLight_Color' ).onChange( function ( val ) {
        ambientLight.color.setHex( val );
        } );

    sunGUI.add( params, 'Sun_AmbientLight_Intensity',  { Off: 0, Default: 0.15, Bright: 0.5 }).onChange( function ( val ) {
      ambientLight.intensity = val;
    } );

    starsGUI.add( params, 'Stars_Num',0,50000,1000).onChange( function ( val ) {
      if(val<50000){
        starfield.geometry =  genStars(val, 1000000, 100000).geometry;
      }
    });
    

    planetsGUI.add( params, 'Planets_Timescale', 0, timeScaleRange, timeScaleRange/100).onChange( function ( val ) {
      if(val<timeScaleRange){timeScale = val;}
    });

    var planets_array = [];
    for(var i =0;i<=numOfPlanets;i++){planets_array[i]=i;}
      
    planetsGUI.add( params, 'Planets_Num', planets_array).onChange( function ( val ) {
      for(var i = 1; i < numOfPlanets+1; i++){
            solarSystem.children[i].visible = (i<=parseInt(val));

      }
    });

    gui.open();
}