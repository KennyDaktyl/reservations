import json
from functools import wraps

from flask import Response
from flask_jwt_extended import get_jwt, jwt_required


def admin_required(fn):
    @wraps(fn)
    @jwt_required() 
    def wrapper(*args, **kwargs):
        try:
            claims = get_jwt()
            if claims.get("role") != "admin":
                return Response(
                    json.dumps({"message": "Admins only!"}),
                    status=403,
                    mimetype="application/json",
                )
        except NoAuthorizationError:
            return Response(
                json.dumps({"message": "Missing Authorization Header"}),
                status=401,
                mimetype="application/json",
            )
        except Exception as e:
            return Response(
                json.dumps({"message": str(e)}),
                status=401,
                mimetype="application/json",
            )
        return fn(*args, **kwargs)

    return wrapper

