import { Game } from '../../startup/Game'
import { Color } from '../map/tiles/Color'

export class HudLayer {
    private game: Game
    public ctx: CanvasRenderingContext2D

    private currentMessage: string = ''
    private currentColor: string = Color.White
    private visible: boolean = false

    private readonly boxPaddingX = 10
    private readonly boxPaddingY = 10
    private readonly innerPadding = 12
    private readonly minLines = 2
    private readonly maxHeightRatio = 0.38

    constructor(game: Game) {
        this.game = game

        const canvas = document.getElementById('hud-layer') as HTMLCanvasElement
        this.ctx = canvas.getContext('2d')!
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0
        this.ctx.shadowBlur = 0
        this.ctx.shadowColor = ''
        this.ctx.canvas.width = this.game.gridConfig.width
        this.ctx.canvas.height = this.game.gridConfig.height
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.game.gridConfig.width, this.game.gridConfig.height)
    }

    /** Show a temporary RPG text box (system or dialog). */
    public showMessage(message: string, color: string = Color.White) {
        this.currentMessage = message
        this.currentColor = color
        this.visible = true
        this.clear()
        this.drawTextBox()
    }

    /** Force-hide the text box. */
    public hideMessage() {
        this.currentMessage = ''
        this.currentColor = Color.White
        this.visible = false
        this.clear()
    }

    private getFontSize(): number {
        // Half-res mobile canvas; keep readable pixel font size
        return this.game.gridConfig.width <= 256 ? 11 : 13
    }

    private getLineHeight(): number {
        return this.getFontSize() + 8
    }

    private drawTextBox() {
        if (!this.visible || !this.currentMessage) {
            return
        }

        const width = this.game.gridConfig.width
        const height = this.game.gridConfig.height
        const fontSize = this.getFontSize()
        const lineHeight = this.getLineHeight()
        const maxBoxHeight = Math.floor(height * this.maxHeightRatio)
        const maxInnerWidth = width - this.boxPaddingX * 2 - this.innerPadding * 2

        this.ctx.font = `${fontSize}px 'Press Start 2P', arial`
        this.ctx.textBaseline = 'top'
        this.ctx.imageSmoothingEnabled = false

        const lines = this.wrapText(this.currentMessage, maxInnerWidth)
        const maxLines = Math.max(
            this.minLines,
            Math.floor((maxBoxHeight - this.innerPadding * 2) / lineHeight)
        )
        const visibleLines = lines.slice(0, maxLines)

        const textBlockHeight = Math.max(this.minLines, visibleLines.length) * lineHeight
        const boxHeight = Math.min(
            maxBoxHeight,
            textBlockHeight + this.innerPadding * 2
        )
        const boxWidth = width - this.boxPaddingX * 2
        const boxX = this.boxPaddingX
        const boxY = height - this.boxPaddingY - boxHeight

        // Darker, more opaque fill so text pops
        this.ctx.fillStyle = 'rgba(0, 20, 0, 0.88)'
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight)

        // Outer border
        this.ctx.strokeStyle = Color.LightYellow3
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(boxX + 1, boxY + 1, boxWidth - 2, boxHeight - 2)

        // Inner border for double-border retro look
        this.ctx.strokeStyle = Color.LightGrey
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(boxX + 4, boxY + 4, boxWidth - 8, boxHeight - 8)

        // Text with dark outline for contrast
        const textX = boxX + this.innerPadding
        let textY = boxY + this.innerPadding
        for (const line of visibleLines) {
            this.drawOutlinedText(line, textX, textY)
            textY += lineHeight
        }
    }

    private drawOutlinedText(text: string, x: number, y: number) {
        this.ctx.lineWidth = 3
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)'
        this.ctx.lineJoin = 'round'
        this.ctx.strokeText(text, x, y)
        this.ctx.fillStyle = this.currentColor
        this.ctx.fillText(text, x, y)
    }

    private wrapText(text: string, maxWidth: number): string[] {
        if (!text) {
            return []
        }

        const words = text.split(' ')
        const lines: string[] = []
        let currentLine = ''

        for (const word of words) {
            const candidate = currentLine ? `${currentLine} ${word}` : word
            if (this.ctx.measureText(candidate).width <= maxWidth) {
                currentLine = candidate
                continue
            }

            if (currentLine) {
                lines.push(currentLine)
                currentLine = ''
            }

            // Word itself may be longer than maxWidth — split by character
            if (this.ctx.measureText(word).width > maxWidth) {
                let chunk = ''
                for (const char of word) {
                    const next = chunk + char
                    if (this.ctx.measureText(next).width > maxWidth && chunk) {
                        lines.push(chunk)
                        chunk = char
                    } else {
                        chunk = next
                    }
                }
                currentLine = chunk
            } else {
                currentLine = word
            }
        }

        if (currentLine) {
            lines.push(currentLine)
        }

        return lines
    }
}
