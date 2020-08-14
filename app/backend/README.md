# Set-up Database

Create account to connect:

```
> db.createUser({user: 'username', pwd: 'password', roles: [{role:'readWrite', db:'MY_DB'}, {role: 'read', db:'MY_DB'}]})
```

then, you will get a response as following:

```
Successfully added user: {
    "user" : "username",
    "roles" : [
        {
            "role" : "readWrite",
            "db" : "MY_DB"
        },
        {
            "role" : "read",
            "db" : "MY_DB"
        }
    ]
}
```

and you can connect with server. put your password for connection:

```
$ mongo mongodb://localhost:27017/MY_DB -u username -p
```
