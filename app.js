const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize')
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

//const sequelize = new Sequelize('sqlite::memory:')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'C:\\\\Users\\\\Максим Сочи\\\\WebstormProjects\\\\millioneer\\\\millioneer.db'
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Укажите автоинкремент
  },
  name: {
    type: DataTypes.STRING,
  },
  earned: {
    type: DataTypes.STRING,
  }
});

const Question = sequelize.define('Question', {
  QuestionText: {
    type: DataTypes.STRING,
  },
  Answer1: {
    type: DataTypes.STRING,
  },
  Answer2: {
    type: DataTypes.STRING,
  },
  Answer3: {
    type: DataTypes.STRING,
  },
  Answer4: {
    type: DataTypes.STRING,
  },
  RightAnswer: {
    type: DataTypes.INTEGER,
  },
  Level: {
    type: DataTypes.INTEGER,
  }
});

app.use(
  express.static(
    path.join(__dirname, 'front')
  )
)

app.use(bodyParser.json());

const db = new sqlite3.Database('millioneer.db');


const getQuestions = () => {
  return new Promise((resolve, reject) => {
    /*db.all('SELECT * FROM Questions', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });*/

    const questions = Question.findAll();
    resolve(questions);
  });
};

async function addUser(req, res) {
  const { u_name, earned } = req.body;
/*
  const sql = `INSERT INTO Users (name, earned) VALUES (?, ?)`;

  await db.run(sql, [u_name, earned]);
*/

  await User.create({
    name: u_name,
    earned: earned
  })

  res.status(201).json({ message: 'User added successfully!'})
}

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    /*db.all('SELECT name, earned FROM Users', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });*/

    const users = User.findAll();
    resolve(users);
  });
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/front/index.html');
});

app.get('/questions', async (req, res) => {
  const questions = await Question.findAll();

  let game_questions = []
  for (let i = 0; i < 15; i++) {
    const lvl_questions = questions.filter((question) => question.Level === i + 1);
    const rnd = getRandomInt(0, lvl_questions.length - 1);
    game_questions.push(lvl_questions[rnd]);
  }

  res.json({ game_questions });
});

app.get('/game', async (req, res) => {
  res.sendFile(__dirname + '/front/game.html');
});

app.post('/game', async (req, res) => {
  const { u_name, earned } = req.body;

  const userAdded = await User.create({
    name: u_name,
    earned: earned
  });

  res.status(201).json({ message: 'User added successfully!'});
})

app.get('/users', async (req, res) => {
  const users = await User.findAll();

  res.json({ users });
})

app.get('/top', async (req, res) => {
  res.sendFile(__dirname + '/front/top.html');
})

app.post('/question', async (req, res) => {
  const { level } = req.body;
  const questions = await Question.findAll({
    where: {
      Level: level,
    },
  })
  const rnd = getRandomInt(0, questions.length - 1);
  const question = questions[rnd];
  res.json({ question });
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});