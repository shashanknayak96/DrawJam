export interface StrokeData {
	id: number,
	width: number,
	color: string, 
	points: StrokePoint[]
}

export interface StrokePoint {
	x: number,
	y: number
}