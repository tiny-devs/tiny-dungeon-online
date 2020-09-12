import { Color } from '../board/map/tiles/Color'

export const Npcs = {
    Dog: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [Color.Brown, 0, 0, 0, 0, Color.Brown, 0, Color.Brown],
        [Color.Brown, 0, 0, 0, 0, Color.Brown, Color.Brown, Color.Brown],
        [0, Color.Brown, Color.Brown, Color.Brown, Color.Brown, Color.Brown, Color.Brown, Color.Brown],
        [0, Color.Brown, Color.Brown, Color.Brown, Color.Brown, Color.Brown, 0, 0],
        [0, Color.Brown, 0, 0, 0, Color.Brown, 0, 0],
        [0, Color.Brown, 0, 0, 0, Color.Brown, 0, 0],
    ],
    Spider: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, Color.Grey, Color.Grey, Color.Grey, Color.Grey, 0, 0],
        [0, Color.Grey, Color.Grey, Color.Grey, Color.Grey, Color.Grey, Color.Grey, 0],
        [0, Color.Grey, Color.DarkPink2, Color.Grey, Color.Grey, Color.DarkPink2, Color.Grey, 0],
        [Color.Grey, Color.Grey, Color.Grey, Color.Grey, Color.Grey, Color.Grey, Color.Grey, Color.Grey],
        [Color.Grey, 0, Color.Grey, 0, 0, Color.Grey, 0, Color.Grey],
        [Color.Grey, 0, Color.Grey, 0, 0, Color.Grey, 0, Color.Grey],
    ],
    Zero: [[0               ,0               ,0               ,Color.LightGrey  ,Color.LightGrey  ,0               ,0               ,0               ],
	[0               ,0               ,0               ,Color.LightGrey  ,Color.LightGrey  ,0               ,0               ,0               ],
	[0               ,0               ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,0               ,0               ],
	[0               ,0               ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,0               ,0               ],
	[0               ,0               ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,0               ,0               ],
	[0               ,0               ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,0               ,0               ],
	[0               ,0               ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,Color.LightGrey  ,0               ,0               ],
	[0               ,0               ,Color.LightGrey  ,0               ,0               ,Color.LightGrey  ,0               ,0               ],],
} as any
