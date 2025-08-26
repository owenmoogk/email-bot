def my_jwt_response_handler(token, user=None, request=None):
    return {
        "token": token,
        "user": {
            "user_id": user.id if user else None,  # Ensure 'id' is included
            "username": user.username if user else None,
            "email": user.email if user else None,
        },
    }
