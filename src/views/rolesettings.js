export default class RoleSettings {
    settings(role=1) {
      /* Roles loading */
      var role_1 = {
        role_id:  "1",
        role_name: "Goalkeepers",
        img_path: "/img/role_1.png",
        role_scale: ["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
        role_domain: [100000, 1000000, 10000000, 30000000, 100000000, 500000000]
      }

      var role_2 = {
        role_id:  "2",
        role_name: "Defenders",
        img_path: "/img/role_2.png",
        role_scale: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
        role_domain: [100000, 1000000, 10000000, 30000000, 100000000, 500000000]
      }

      var role_3 = {
        role_id:  "3",
        role_name: "Midfielders",
        img_path: "/img/role_3.png",
        role_scale: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
        role_domain: [100000, 1000000, 10000000, 30000000, 100000000, 500000000]
      }

      var role_4 = {
        role_id:  "4",
        role_name: "Strikers",
        img_path: "/img/role_4.png",
        role_scale: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
        role_domain: [100000, 1000000, 10000000, 30000000, 100000000, 500000000]
      }

      
      var to_be_returned = role_1;
      switch (role) {
        case 1:
          to_be_returned = role_1;
          break;
        case 2:
          to_be_returned = role_2;
          break;
        case 3:
          to_be_returned = role_3;
          break;
        case 4:
          to_be_returned = role_4;
          break;
        default:
          to_be_returned = role_1;
          break;
      }

      return to_be_returned;
    }
}

