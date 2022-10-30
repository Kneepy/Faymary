package faymary

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import faymary.plugins.routes.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        configureSockets()
        messageSockets()
    }.start(wait = true)
}
