const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let countRequest = 0;

server.use((req, res, next) => {
  console.log(`Quantidade de requisições : ${++countRequest}`);
  return next();
});

function checkProjectExists(req, res, next) {
  const { id: paramId } = req.params;
  const project = projects.find(({ id }) => id === paramId);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }
  req.project = project;
  return next();
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  return res.json(project);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id: paramId } = req.params;

  const index = projects.findIndex(({ id }) => id === paramId);

  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;
  req.project.tasks.push(title);
  return res.json(projects);
});

server.listen(3000);
