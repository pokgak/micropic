# design

- /picture
    - GET: /:uuid
    - POST/PUT:
        - body contains image file
        - use uuid to identify picture
        - save to local storage
        - return /picture/:uuid as permanent link
        - or error if not valid
    - DELETE: /:uuid