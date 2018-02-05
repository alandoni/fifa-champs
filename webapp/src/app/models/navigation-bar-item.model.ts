export class NavigationBarItem {
    label : String;
    action : any;
    link : String;

    constructor(label : String, link : String, action : any) {
        this.label = label;
        this.link = link;
        this.action = action;
    }
}
