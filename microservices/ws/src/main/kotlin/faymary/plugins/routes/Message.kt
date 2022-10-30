package faymary.plugins.routes

import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*

fun Application.messageSockets() {
    routing {
        webSocket("/message") {

        }
    }
}

