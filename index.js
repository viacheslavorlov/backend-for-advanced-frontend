const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const dbFile = "db.json";
function readDB() {
	return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
}
function writeDB(data) {
	fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}
// авторизация для пользователя
app.post('/login', (req, res) => {
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
		
		let errorMessage = 'User not found';
		
		return res.status(403).json({ message: errorMessage });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: 'Произошла ошибка: ' + e.message });
	}
});


// Работа с уведомлениями
app.get("/api/notifications", (req, res) => {
	const db = readDB();
	res.json(db.notifications);
});
app.post("/api/notifications", (req, res) => {
	const db = readDB();
	const newNotification = req.body;
	newNotification.id = Date.now().toString();
	db.notifications.push(newNotification);
	writeDB(db);
	res.json(newNotification);
});
// Работа со статьями
app.get("/api/articles", (req, res) => {
	const db = readDB();
	res.json(db.articles);
});
app.post("/api/articles", (req, res) => {
	const db = readDB();
	const newArticle = req.body;
	newArticle.id = Date.now().toString();
	db.articles.push(newArticle);
	writeDB(db);
	res.json(newArticle);
});
// Работа с комментариями
app.get("/api/comments", (req, res) => {
	const db = readDB();
	res.json(db.comments);
});
app.post("/api/comments", (req, res) => {
	const db = readDB();
	const newComment = req.body;
	newComment.id = Date.now().toString();
	db.comments.push(newComment);
	writeDB(db);
	res.json(newComment);
});
// Работа с пользователями
app.get("/api/users", (req, res) => {
	const db = readDB();
	res.json(db.users);
});
app.post("/api/users", (req, res) => {
	const db = readDB();
	const newUser = req.body;
	newUser.id = Date.now().toString();
	db.users.push(newUser);
	writeDB(db);
	res.json(newUser);
});
// Работа с профилями
app.get("/api/profile", (req, res) => {
	const db = readDB();
	res.json(db.profile);
});
app.post("/api/profile", (req, res) => {
	const db = readDB();
	const newProfile = req.body;
	newProfile.id = Date.now().toString();
	db.profile.push(newProfile);
	writeDB(db);
	res.json(newProfile);
});
// Работа с рейтингами статей
app.get("/api/article-ratings", (req, res) => {
	const db = readDB();
	res.json(db["article-ratings"]);
});
app.post("/api/article-ratings", (req, res) => {
	const db = readDB();
	const newRating = req.body;
	newRating.id = Date.now().toString();
	db["article-ratings"].push(newRating);
	writeDB(db);
	res.json(newRating);
});
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
