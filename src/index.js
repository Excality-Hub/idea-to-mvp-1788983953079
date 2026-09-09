let todos = [];
let nextId = 1;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/todos" && request.method === "GET") {
      return Response.json(todos);
    }

    if (pathname === "/todos" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
      }

      if (typeof body.title !== "string" || body.title.trim() === "") {
        return Response.json({ error: "title is required" }, { status: 400 });
      }

      const todo = {
        id: nextId++,
        title: body.title,
        done: false,
        createdAt: new Date().toISOString(),
      };
      todos.push(todo);
      return Response.json(todo, { status: 201 });
    }

    const doneMatch = pathname.match(/^\/todos\/(\d+)\/done$/);
    if (doneMatch && request.method === "POST") {
      const id = parseInt(doneMatch[1], 10);
      const todo = todos.find((t) => t.id === id);
      if (!todo) {
        return Response.json({ error: "Todo not found" }, { status: 404 });
      }
      todo.done = true;
      return Response.json(todo);
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
};
