const users = {
    "title": "User Schema",
    "version": 0,
    "description": "Describes a single user",
    "primaryKey": "id",
    "type": "object",
    "properties": {
        "id": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string"
        }
    }
}

export {users};