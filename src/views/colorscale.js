export default class ColorBrewerLinear {

    //range domain
    domain(n=7){
        if(n==5){
            return [100000, 1000000, 10000000, 30000000];
        }else{
        //default return 7..
            return [100000, 1000000, 10000000, 30000000, 100000000, 500000000];
        }
    }

    scale(scale, n=7) { 
        switch (scale) {
            case 1:
                //green scale
                if(n==5){
                    return ['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'];
                }else{
                //default return 7..
                    return ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"];
                }
              break;
            case 2:
                //violet scale
                if(n==5){
                        return ['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'];
                }else{
                //default return 7..
                    return ['#edf8fb','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#6e016b'];
                }
              break;
            case 3:
                //green-blue scale
                if(n==5){
                    return ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'];
                }else{
                //default return 7..
                    return ['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#08589e'];
                }
              break;
            case 4:
                //red scale 1
                if(n==5){
                    return ['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000'];
                }else{
                //default return 7..
                    return ['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#990000'];
                }
              break;
            case 5:
                //blu scale
                if(n==5){
                    return ['#f1eef6','#bdc9e1','#74a9cf','#2b8cbe','#045a8d'];
                }else{
                //default return 7..
                    return ['#f1eef6','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b'];
                }
              break;
            case 6:
                //blu-green 
                if(n==5){
                    return ['#f6eff7','#bdc9e1','#67a9cf','#1c9099','#016c59'];
                }else{
                    return ['#f6eff7','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016450'];
                }
                break;
            case 7:
                //purple-red 
                if(n==5){
                    return ['#f1eef6','#d7b5d8','#df65b0','#dd1c77','#980043'];
                }else{
                    return ['#f1eef6','#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f'];
                }
                break;
            case 8:
                //purple-pink 
                if(n==5){
                    return ['#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177'];
                }else{
                    return ['#feebe2','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177'];
                }
                break;
            case 9:
                //green 2
                if(n==5){
                    return ['#ffffcc','#c2e699','#78c679','#31a354','#006837'];
                }else{
                    return ['#ffffcc','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#005a32'];
                }
                break;
            case 10:
                //green 2
                if(n==5){
                    return ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'];
                }else{
                    return ['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'];
                }
                break;
            case 11:
                //orange
                if(n==5){
                    return ['#ffffd4','#fed98e','#fe9929','#d95f0e','#993404'];
                }else{
                    return ['#ffffd4','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#8c2d04'];
                }
                break;
            case 12:
                //red (last)
                if(n==5){
                    return ['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'];
                }else{
                    return ['#ffffb2','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];
                }
                break;
            default:
                if(n==5){
                    return ['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'];
                }else{
                //default return 7..
                    return ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"];
                }
              break;
          }
    }
/*
    //green scale
    scale1(n=7) { 
        if(n==5){
            return ['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'];
        }else{
        //default return 7..
            return ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"];
        }
    }

    //violet scale
    scale2(n=7) { 
        if(n==5){
            return ['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'];
        }else{
        //default return 7..
            return ['#edf8fb','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#6e016b'];
        }
    }

    //green-blue scale
    scale3(n=7) { 
        if(n==5){
            return ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'];
        }else{
        //default return 7..
            return ['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#08589e'];
        }
    }

    //red scale 1
    scale4(n=7) { 
        if(n==5){
            return ['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000'];
        }else{
        //default return 7..
            return ['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#990000'];
        }
    }

    //blu scale
    scale5(n=7) { 
        if(n==5){
            return ['#f1eef6','#bdc9e1','#74a9cf','#2b8cbe','#045a8d'];
        }else{
        //default return 7..
            return ['#f1eef6','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b'];
        }
    }
*/


}

