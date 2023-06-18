const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, 'db.json'));
server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

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

// Эндпоинт для получения всех комментариев
server.get('/comments', (req, res) => {
	const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
	const comments = db.comments;
	return res.json(comments);
});
// Эндпоинт для добавления комментария
server.post('/comments', (req, res) => {
	const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
	const comments = db.comments;
	const newComment = req.body;
	newComment.id = comments.length + 1;
	comments.push(newComment);
	fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2));
	return res.json(newComment);
});
// Эндпоинт для получения профиля по ID
server.get('/profile/:id', (req, res) => {
	const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
	const { id } = req.params;
	const profile = db.profiles.find((p) => p.id === parseInt(id));
	if (profile) {
		return res.json(profile);
	}
	return res.status(404).json({ message: `Profile ${id} not found` });
});
// Эндпоинт для обновления профиля по ID
server.put('/profile/:id', (req, res) => {
	const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
	const { id } = req.params;
	const profileIndex = db.profiles.findIndex((p) => p.id === parseInt(id));
	if (profileIndex === -1) {
		return res.status(404).json({ message: `Profile ${id} not found` });
	}
	const updatedProfile = req.body;
	updatedProfile.id = parseInt(id);
	db.profiles[profileIndex] = updatedProfile;
	fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2));
	return res.json(updatedProfile);
});
// Эндпоинт для получения уведомлений
server.get('/notifications', (req, res) => {
	const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
	const notifications = db.notifications;
	return res.json(notifications);
});
// Эндпоинт для получения всех статей
server.get('/articles', (req, res) => {
	const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
	const articles = db.articles;
	return res.json(articles);
});
// Эндпоинт для добавления статьи
server.post('/articles', (req, res) => {
	const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
	const articles = db.articles;
	const newArticle = req.body;
	newArticle.id = articles.length + 1;
	articles.push(newArticle);
	fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2));
	return res.json(newArticle);
});
// Эндпоинт для получения статьи по ID
server.get('/articles/:id', (req, res) => {
	const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
	const { id } = req.params;
	const article = db.articles.find((a) => a.id === parseInt(id));
	if (article) {
		return res.json(article);
	}
	return res.status(404).json({ message: `Article ${id} not found` });
});
// Запуск сервера
server.use(router);
server.listen(process.env.PORT || 8000, () => {
	console.log('Server is running');
});
