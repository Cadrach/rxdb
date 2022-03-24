const users = {
    "title": "User Schema",
    "version": 0,
    "description": "Describes a single user",
    "primaryKey": "uuid",
    "type": "object",
    "properties": {
        "uuid": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "created_at": {
            "type": "string"
        },
        "updated_at": {
            "type": "string"
        },
        "deleted_at": {
            "type": "string"
        },
    }
}

export {users};