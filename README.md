# Service for Uploading Pictures

Chosen microframework: ExpressJS

Requirements: a directory `uploads/`, where the service is started. Run `node app.js` to start the service.

The API:

- `/picture`
    - POST: upload new picture
- `/picture/{filename}`
    - GET: download picture from link
    - DELETE: delete uploaded image

What is done:

- Story 1:
    - handle upload picture
    - reject if uploaded file is not a picture
    - return permanent link to picture
- Story 2.1:
    - acccept upload of zip file containing multiple pictures
    - return permanent link for each of the picture
- Story 2.2:
    - generate thumbnail for images bigger than 128px by 128px
    - thumbnail encoded as base64 in JSON response
    - thumbnails respect the uploaded image aspect ratio

Not done:

- Testing
- generate multiple thumbnail (only 32px are generated)

## Testing Ideas

- check file is uploaded and can be found in `uploads/` directory
- upload of valid file extension but with invalid content e.g. a text (`.txt`) file with the extension changed to `.jpg`
- check link returned after upload is valid
- check zip is extracted with correctly
- check zip uploads return multiple valid links to pictures
- `calculateThumbnailPercentage` returns 100 when smaller than 128x128 px
- `calculateThumbnailPercentage` returns percentages to shrink picture to width 32px and 64px
- check aspect ratio of image is maintained
- check picture deleted after DELETE request