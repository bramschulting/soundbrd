const Player = require('play-sound');
const path = require('path');
const Table = require('cli-table');
const lowdb = require('lowdb');

const db = lowdb(path.join(__dirname, 'db.json'));

db.defaults({ sounds: [] }).value();

function play (filePath) {
  const player = new Player();

  player.play(filePath, err => {
    if (err) {
      throw err;
    }
  });
}

function find (id) {
  const soundById = db.get('sounds').find({ id: id }).value();
  const soundByName = db.get('sounds').find({ name: id }).value();

  return soundById || soundByName;
}

function add (name, filePath) {
  const id = db.get('sounds').size().value() + 1;
  const absolutePath = path.normalize(filePath);

  db.get('sounds').push({
    id,
    name,
    filePath: absolutePath
  }).value();
}

function remove (id) {
  db.get('sounds').remove({ id }).value();
}

function list () {
  const table = new Table({
    head: ['ID', 'Name', 'Filename']
  });

  db.get('sounds').value().forEach(sound => {
    const fileName = path.basename(sound.filePath);

    table.push([sound.id, sound.name, fileName]);
  });

  console.log(table.toString());
}

module.exports = {
  play,
  find,
  list,
  add,
  remove
};
