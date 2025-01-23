let clients = []; // Array to store active SSE connections

export default function handler(req, res) {
  if (req.method === "POST") {
    // Broadcast the update to all connected clients
    const payload = req.body;

    clients.forEach((client) =>
      client.res.write(`data: ${JSON.stringify(payload)}\n\n`)
    );

    res.status(200).json({ message: "Update broadcasted" });
  } else if (req.method === "GET") {
    // Handle SSE connections
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Add client connection to the array
    clients.push({ id: Date.now(), res });

    // Remove client when connection closes
    req.on("close", () => {
      clients = clients.filter((client) => client.res !== res);
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
