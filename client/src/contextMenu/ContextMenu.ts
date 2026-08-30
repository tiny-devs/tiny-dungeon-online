import { ItemsIds } from "../../../shared/Enums"
import { GameClient } from "../startup/GameClient"

export default class ContextMenu {
    public contextMenuEl: HTMLElement
    public contextMenuOptionEls: NodeListOf<HTMLElement>
    public menuVisible: boolean
    private client: GameClient
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

    }

    public openMenu(itemId: ItemsIds, clientX: number, clientY: number) {
        this.currentItemId = itemId
        const storeOption = document.getElementById('store-menu-option')
        if (storeOption) {
            storeOption.style.display = this.client.bankOpen ? 'block' : 'none'
        }
        this.setPosition(clientY, clientX)
    }

    private handleOptionSelected(optionSelected: string) {
        if (this.currentItemId != null) {
            if (optionSelected == 'Drop') {
                this.client.dropItem(this.currentItemId)
            }
            if (optionSelected == 'Inspect') {
                this.client.sendItemInfo(this.currentItemId)
            }
            if (optionSelected == 'Store') {
                this.client.storeItem(this.currentItemId)
            }
        }
        
        this.hideMenu()
    }

    private toggleMenu(command: string) {
        this.contextMenuEl.style.display = command === "show" ? "block" : "none";
        this.menuVisible = command === "show";
    }

    private setPosition(top: number, left: number) {
        this.toggleMenu("show");
        const bounds = this.contextMenuEl.getBoundingClientRect()
        const maxLeft = Math.max(0, window.innerWidth - bounds.width)
        const maxTop = Math.max(0, window.innerHeight - bounds.height)
        this.contextMenuEl.style.left = `${Math.max(0, Math.min(left, maxLeft))}px`;
        this.contextMenuEl.style.top = `${Math.max(0, Math.min(top, maxTop))}px`;
    }

    private hideMenu() {
        this.currentItemId = null
        this.toggleMenu("hide")
    }
}
