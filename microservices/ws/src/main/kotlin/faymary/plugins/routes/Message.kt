package faymary.plugins.routes

import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.server.response.*

fun Application.messageSockets() {
    routing {
        webSocket("/message") {

        }
        get("/") {
            call.respondText("Hello world")
        }   
    }
}

