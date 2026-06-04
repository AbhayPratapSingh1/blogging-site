export class NavigationsHandler {

  constructor(navigations, id) {
    this.navigations = navigations
    this.id = id;
  }
  nextId() {
    return this.id++;
  }
  addNewNavigation(name, link, position, siteId) {
    const id = this.nextId();
    this.navigations[id] = { name, link, position, siteId }
    return id
  }
  getNavigationBySiteId(siteId) {
    const navs = []
    for (const [id, value] of Object.entries(this.navigations)) {
      if (value.siteId === siteId) {
        navs.push({ ...value, _id: id })
      }
    }
    return navs;
  }
  getNavigationByNavId(id) {
    return this.navigations[id];
  }
  deleteNavigationByNavId(id) {
    delete this.navigations[id];
    return id;
  }
}


