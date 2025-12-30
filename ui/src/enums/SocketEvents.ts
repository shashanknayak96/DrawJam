export const SocketEvent = {
	CREATE_ROOM: "create-room",
	ROOM_CREATED: "room-created",

	JOIN_ROOM: "join-room",
	JOIN_SUCCESS: "join-success",
	JOIN_ERROR: "join-error",

	GET_ROOM_STATE: "get-room-state",
	ROOM_STATE: "room-state",

	DRAW_STROKE: "draw-stroke",
	RECEIVE_STROKE: "receive-stroke",

	CLEAR_CANVAS: "clear-canvas",
	ROOM_USERS_UPDATE: "room-users-update",

	LEAVE_SERVER: "leave-server"
} as const;
