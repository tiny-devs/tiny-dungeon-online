import { ItemsIds } from "../../../shared/Enums"
import { GameClient } from "../startup/GameClient"

export default class ContextMenu {
    public contextMenuEl: HTMLElement
    public contextMenuOptionEls: NodeListOf<HTMLElement>
    public menuVisible: boolean
    private client: GameClient
    private originTop: number = 0
    private originLeft: number = 0
    private currentItemId: ItemsIds | null

    constructor(client: GameClient) {
        this.client = client
        this.contextMenuEl = document.querySelector(".menu")!
        this.contextMenuOptionEls = document.querySelectorAll(".menu-option")!
        this.menuVisible = false;
        this.currentItemId = null

        window.addEventListener("click", _ => {
            this.hideMenu()
        })

        this.contextMenuOptionEls.forEach(x => {
            x.addEventListener("click", e => {
                const eAny = e as any
                this.handleOptionSelected(eAny.target.innerHTML)
            })
        })

        window.addEventListener("contextmenu", e => {
            e.preventDefault();
            return false;
        })

        window.addEventListener("mousemove", e => {
            this.originTop = e.pageY
            this.originLeft = e.pageX
        })
    }

    public openMenu(itemId: ItemsIds) {
        this.currentItemId = itemId
        this.setPosition(this.originTop, this.originLeft)
    }

    private handleOptionSelected(optionSelected: string) {
        if (this.currentItemId != null) {
            if (optionSelected == 'Drop') {
                this.client.dropItem(this.currentItemId)
            }
            if (optionSelected == 'Inspect') {
                this.client.sendItemInfo(this.currentItemId)
            }
        }
        
        this.hideMenu()
    }

    private toggleMenu(command: string) {
        this.contextMenuEl.style.display = command === "show" ? "block" : "none";
        this.menuVisible = !this.menuVisible;
    }

    private setPosition(top: number, left: number) {
        this.contextMenuEl.style.left = `${left}px`;
        this.contextMenuEl.style.top = `${top}px`;
        this.toggleMenu("show");
    }

    private hideMenu() {
        this.currentItemId = null
        this.toggleMenu("hide")
    }
}