def create_error_response(message=None, place=None):
    return {
        "success": False,
        "error": {
            "message": message,
            "place": place
        }
    }