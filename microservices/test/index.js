const app = require("express")()
const request = require("request")
const SPOTIFY_CLIENT_ID = "2948d0f32b3a444bb8829a872e134cee"
const SPOTIFY_CLIENT_SECRET = "54fbd565c64a460a907e1f937b96992e"
const request_options = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

app.get("/", (req, res) => {
    request.post(request_options, (errors, response, body) => {
        if(!error && response.statusCode === 200) {
            const options = {
                url: 'https://api.spotify.com/v1/users/jmperezperez',
                headers: {
                    'Authorization': 'Bearer ' + body.access_token
                },
                json: true
            };
        }
    })
})

app.listen(5000)