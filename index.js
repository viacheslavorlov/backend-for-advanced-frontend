const express = require("express");
const app = express();
const port = 3000;
const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
app.use("/api", middlewares);
app.use("/api", router);

// Эндпоинт для логина
server.post('/login', (req, res) => {
	try {
		const { username, password } = req.body;
		const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
		const { users = [] } = db;
		
		const userFromBd = users.find(
			(user) => user.username === username && user.password === password,
		);
		
		if (userFromBd) {
			return res.json(userFromBd);
		}
		
		return res.status(403).json({ message: 'User not found' });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: e.message });
	}
});

// проверяем, авторизован ли пользователь
// eslint-disable-next-line
app.use((req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(403).json({ message: 'AUTH ERROR' });
	}
	
	next();
});

app.use(router);

	
	app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
