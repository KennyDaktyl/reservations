import os
from app import create_app, socketio

config_type = os.getenv("FLASK_ENV", "development")  
port = int(os.getenv("PORT", 5010))  
debug = config_type == "development" 

app = create_app(config_type=config_type)

print(f"Starting app in {config_type} mode, DEBUG={debug}")
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=port, debug=debug)
