import { ItemsIds, GearType } from "../../models/Enums"
import { Items } from "./Items"
import { Client } from "../../startup/Client"
import GearItem from "./GearItem"

export default class Gear {
    public head: GearItem
    public torso: GearItem
    public legs: GearItem
    public weapon: GearItem
    public playerId: string = ''
    private client: Client

    constructor(client: Client) {
        this.head = new GearItem(this,ItemsIds.Empty,Items.Empty,'head')
        this.torso = new GearItem(this,ItemsIds.Empty,Items.Empty,'torso')
        this.legs = new GearItem(this,ItemsIds.Empty,Items.Empty,'legs')
        this.weapon = new GearItem(this,ItemsIds.Empty,Items.Empty,'weapon')

        this.head.layer.c.onmousedown = (e) => this.clickItem(e, this.head)
        this.torso.layer.c.onmousedown = (e) => this.clickItem(e, this.torso)
        this.legs.layer.c.onmousedown = (e) => this.clickItem(e, this.legs)
        this.weapon.layer.c.onmousedown = (e) => this.clickItem(e, this.weapon)

        this.head.layer.c.ontouchstart = (e) => this.clickItem(e, this.head)
        this.torso.layer.c.ontouchstart = (e) => this.clickItem(e, this.torso)
        this.legs.layer.c.ontouchstart = (e) => this.clickItem(e, this.legs)
        this.weapon.layer.c.ontouchstart = (e) => this.clickItem(e, this.weapon)

        this.head.layer.c.oncontextmenu = () => false
        this.torso.layer.c.oncontextmenu = () => false
        this.legs.layer.c.oncontextmenu = () => false
        this.weapon.layer.c.oncontextmenu = () => false

        this.client = client
        this.drawGear()
    }

    public drawGear() {
        this.head.draw()
        this.torso.draw()
        this.legs.draw()
        this.weapon.draw()
    }

    public addGear(itemId: ItemsIds, gearType: GearType) {
        switch (gearType) {
            case GearType.Head:
                if (this.head.itemId == ItemsIds.Empty) {
                    this.head.changeGear(itemId, this.getItemSprite(itemId))
                }
                break;
            case GearType.Torso:
                if (this.torso.itemId == ItemsIds.Empty) {
                    this.torso.changeGear(itemId, this.getItemSprite(itemId))
                }
                break;
            case GearType.Legs:
                if (this.legs.itemId == ItemsIds.Empty) {
                    this.legs.changeGear(itemId, this.getItemSprite(itemId))
                }
                break;
            case GearType.Weapon:
                if (this.weapon.itemId == ItemsIds.Empty) {
                    this.weapon.changeGear(itemId, this.getItemSprite(itemId))
                }
                break;
            default:
                break;
        }
        this.drawGear()
    }

    public clickItem(e: Partial<MouseEvent>, item: any) {
        if (item.itemId != ItemsIds.Empty) {
            if (
                e.type === 'mousedown' ||
                e.type === 'touchstart' ||
                e.type === 'touchmove'
            ) {
                if (e.type === 'mousedown') {
                    if (e.button == 0) {
                        this.client.removeGear(item.itemId)
                    }
                } else {
                    this.client.removeGear(item.itemId)
                }
            }
        }
    }

    public removeGear(itemId: ItemsIds) {
        if (this.head.itemId == itemId) {
            this.head.changeGear(ItemsIds.Empty, this.getItemSprite(ItemsIds.Empty))
        }
        if (this.torso.itemId == itemId) {
            this.torso.changeGear(ItemsIds.Empty, this.getItemSprite(ItemsIds.Empty))
        }
        if (this.legs.itemId == itemId) {
            this.legs.changeGear(ItemsIds.Empty, this.getItemSprite(ItemsIds.Empty))
        }
        if (this.weapon.itemId == itemId) {
            this.weapon.changeGear(ItemsIds.Empty, this.getItemSprite(ItemsIds.Empty))
        }
        this.drawGear()
    }

    private getItemSprite(itemId: ItemsIds) {
        let keyOfItemId = ItemsIds[itemId]
        let items = Items as any
        return items[keyOfItemId]
    }
}