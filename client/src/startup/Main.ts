import { ClientConfig, PlayerConfig, DimensionsConfig } from '../models/configs'
import { DrawingCanvas } from '../drawingCanvas/DrawingCanvas'
import { Game } from './Game'
import { Client } from './Client'

export class Main {
    public loginScreen: HTMLElement
    public resetCanvasBtn: HTMLElement
    public mobileControls: HTMLElement
    public playerNameInput: HTMLInputElement
    public confirmBtn: HTMLElement
    public mobileUp: HTMLElement
    public mobileDown: HTMLElement
    public mobileLeft: HTMLElement
    public mobileRight: HTMLElement
    public gameScreen: HTMLElement
    public bagElement: HTMLElement
    public layersParentElement: HTMLElement

    public drawingGrid: DrawingCanvas

    private playerConfig: PlayerConfig
    private gameConfig: DimensionsConfig

    private hasConfirmedName: boolean
    public game: Game | null
    public client: Client | null

    constructor(configs: ClientConfig) {
        this.loginScreen = document.getElementById('login')!
        this.resetCanvasBtn = document.getElementById('help-draw-mobile')!
        this.mobileControls = document.getElementById('mobile-controls')!
        this.playerNameInput = document.getElementById('player-name') as HTMLInputElement
        this.confirmBtn = document.getElementById('confirm-btn')!
        this.mobileUp = document.getElementById('up')!
        this.mobileDown = document.getElementById('down')!
        this.mobileLeft = document.getElementById('left')!
        this.mobileRight = document.getElementById('right')!
        this.gameScreen = document.getElementById('game')!
        this.bagElement = document.getElementById('bag')!
        this.layersParentElement = document.getElementById('layers')!

        this.gameScreen.style.display = 'none'
        this.bagElement.style.display = 'none'

        if (this.isMobile()) {
            this.setupMobile()
            configs.game.width = configs.game.width / 2
            configs.game.height = configs.game.height / 2
        }

        this.layersParentElement.style.width = `${configs.game.width}px`
        this.layersParentElement.style.height = `${configs.game.height}px`

        this.drawingGrid = new DrawingCanvas(configs.drawingGrid)

        this.playerConfig = {
            playerName: '',
            playerMatrix: [],
        }

        this.gameConfig = configs.game

        this.game = null
        this.client = null
        this.hasConfirmedName = false

        this.confirmBtn.onclick = () => {
            this.onConfirmName()
        }

        this.resetCanvasBtn.onclick = () => {
            this.drawingGrid.reset()
        }
    }

    setupMobile() {
        document.body.addEventListener(
            'touchmove',
            (e) => {
                e.preventDefault()
            },
            { passive: false }
        )
        const helpDesktop = document.getElementById('help-draw-desktop')!
        helpDesktop.style.display = 'none'
        this.resetCanvasBtn.style.display = 'block'
        this.layersParentElement.style.width = `${window.screen.width}px`
    }

    onConfirmName() {
        if (!this.hasConfirmedName) {
            if (this.playerNameInput.value) {
                this.playerConfig.playerName = this.playerNameInput.value
                const hasDraw = this.drawingGrid.drawingMatrix.some((line) => line.some((collumn) => collumn === 1))
                if (hasDraw) {
                    this.hasConfirmedName = true
                    this.playerConfig.playerMatrix = this.drawingGrid.drawingMatrix.map((arr) => arr.slice())

                    if (this.isMobile()) {
                        const title = document.getElementById('title')!
                        const subtitle = document.getElementById('sub-title')!
                        title.style.fontSize = '1em'
                        subtitle.style.fontSize = '50%'
                    }
                    this.startGame()
                }
            }
        }
    }

    private startGame() {
        this.game = new Game(this.gameConfig, this)
        this.client = new Client(this.game, this.playerConfig, this)
    }

    public isMobile(): boolean {
        const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]

        return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem))
    }
}
