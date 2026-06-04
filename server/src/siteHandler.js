export class SiteHandler {
  constructor(id, siteName) {
    this.name = siteName
    this.id = id
    this.navigations = [];
    this.navId = 1;
  }

  isValidUser(email, password) {
    return email === "user@gmail.com" && password === "12345"
  }
  getUserDetail() {
    return { profilePic: { url: "https://www.w3schools.com/howto/img_avatar.png" }, name: "Rajesh" }
  }
  getSiteDetail() {
    return { name: this.name, _id: this.id, isActive: true }
  }

  setNavigations(navigations) {
    this.navigations = navigations.map((props, id) => ({ _id: this.navId++, ...props, site: this.name }))

  }
  addNavigation(...ids) {


    this.navigations.push(...ids);
  }
  getNavigations() {
    return this.navigations;
  }
}