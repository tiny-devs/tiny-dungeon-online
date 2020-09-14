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
        [0, 0, Color.Black, Color.Black, Color.Black, Color.Black, 0, 0],
        [0, Color.Black, Color.Black, Color.Black, Color.Black, Color.Black, Color.Black, 0],
        [0, Color.Black, Color.DarkPink2, Color.Black, Color.Black, Color.DarkPink2, Color.Black, 0],
        [Color.Black, Color.Black, Color.Black, Color.Black, Color.Black, Color.Black, Color.Black, Color.Black],
        [Color.Black, 0, Color.Black, 0, 0, Color.Black, 0, Color.Black],
        [Color.Black, 0, Color.Black, 0, 0, Color.Black, 0, Color.Black],
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
