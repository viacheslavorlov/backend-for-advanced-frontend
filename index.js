const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();

const router = jsonServer.router(path.resolve(__dirname, 'db.json'));

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

// Нужно для небольшой задержки, чтобы запрос проходил не мгновенно, имитация реального апи
// server.use(async (req, res, next) => {
//     await new Promise((res) => {
//         setTimeout(res, 800);
//     });
//     next();
// });

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
server.use((req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(403).json({ message: 'AUTH ERROR' });
	}
	
	next();
});

// обработчик POST запросов
server.post('/:resource', (req, res) => {
	try {
		const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
		const { resource } = req.params;
		
		if (!db[resource]) {
			return res.status(404).json({ message: `Resource ${resource} not found` });
		}
		
		const newRecord = req.body;
		newRecord.id = db[resource].length + 1;
		db[resource].push(newRecord);
		
		fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2));
		
		return res.json(newRecord);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: e.message });
	}
});

// обработчик PUT запросов
server.put('/:resource/:id', (req, res) => {
	try {
		const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
		const { resource, id } = req.params;
		
		if (!db[resource]) {
			return res.status(404).json({ message: `Resource ${resource} not found` });
		}
		
		const recordIndex = db[resource].findIndex((record) => record.id === parseInt(id));
		
		if (recordIndex === -1) {
			return res.status(404).json({ message: `Record ${id} not found` });
		}
		
		const updatedRecord = req.body;
		updatedRecord.id = parseInt(id);
		db[resource][recordIndex] = updatedRecord;
		
		fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db, null, 2));
		
		return res.json(updatedRecord);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: e.message });
	}
});

server.use(router);

// запуск сервера
server.listen(process.env.PORT || 8000, () => {
	console.log('server is running');
});
