from flask_socketio import emit, join_room, leave_room

from app import socketio


@socketio.on("connect")
def handle_connect():
    """Obsługa połączenia WebSocket."""
    emit("message", {"data": "Connected to WebSocket!"})
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    """Obsługa rozłączenia WebSocket."""
    print("Client disconnected")


@socketio.on("join")
def on_join(data):
    """Dołącz klienta do pokoju."""
    room = data.get("room")
    join_room(room)
    emit("message", {"data": f"Joined room: {room}"}, to=room)


@socketio.on("leave")
def on_leave(data):
    """Rozłącz klienta z pokoju."""
    room = data.get("room")
    leave_room(room)
    emit("message", {"data": f"Left room: {room}"}, to=room)


def notify_reservation_update(action, reservation):
    """Wysyłanie informacji o rezerwacji."""
    data = {
        "action": action,
        "reservation": reservation,
    }
    socketio.emit("reservation_update", data)
