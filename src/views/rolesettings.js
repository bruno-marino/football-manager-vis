export default class RoleSettings {

    constructor(role_id, role_name, img_path, role_scale, role_domain) {
        this.role_id = role_id;
        this.role_name = role_name;
        this.img_path = img_path;
        this.role_scale = role_scale;
        this.role_domain = role_domain;
    }

    /* Getters and setters */
    get rid() {
        return this.role_id;
      }
    set rid(x) {
        this.role_id = x;
    }
    get rname() {
        return this.role_name;
      }
    set rname(x) {
        this.role_name = x;
    }
    get rimg() {
        return this.img_path;
      }
    set rimg(x) {
        this.img_path = x;
    }
    get rscale() {
        return this.role_scale;
      }
    set rscale(x) {
        this.role_scale = x;
    }
    get rdomain() {
        return this.role_domain;
      }
    set rdomain(x) {
        this.role_domain = x;
    }
    
}

