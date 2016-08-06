const minimist = require('minimist');
const Soundbrd = require('./Soundbrd');
const readline = require('readline');

const argv = minimist(process.argv.slice(2));
const command = argv._[0];

function playSound (args) {
  const id = args._[1];
  const sound = Soundbrd.find(id);

  if (!sound) {
    return console.log(`Could not find sound "${id}"`);
  }

  Soundbrd.play(sound.filePath);
}

function addSound (args) {
  const name = args._[1];
  const filePath = args._[2];

  Soundbrd.add(name, filePath);
  Soundbrd.list();
}

function deleteSound (args) {
  const id = args._[1];
  const sound = Soundbrd.find(id);

  if (!sound) {
    return console.log(`Could not find sound "${id}"`);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`Are you sure you want to delete "${sound.name}"? (yes/no): `, answer => {
    if (answer === 'yes') {
      Soundbrd.remove(sound.id);
      Soundbrd.list();
    } else {
      console.log('Aborted.')
    }

    rl.close();
  });
}

function listSounds () {
  Soundbrd.list();
}

function printManual () {
  console.log('Usage: soundbrd <command>\n');

  console.log('Add sounds:');
  console.log('    soundbrd add <name> <path>\n');
  console.log('    Example:');
  console.log('    soundbrd add foo foo.mp3\n');
  console.log('    Alias(es):');
  console.log('    a');

  console.log('Play sounds:');
  console.log('    soundbrd add <id|name>\n');
  console.log('    Example:');
  console.log('    soundbrd play foo\n');
  console.log('    Alias(es):');
  console.log('    p');

  console.log('List sounds:');
  console.log('    soundbrd list\n');
  console.log('    Alias(es):');
  console.log('    l, ls');

  console.log('Remove sounds:');
  console.log('    soundbrd delete <id|name>\n');
  console.log('    Example:');
  console.log('    soundbrd delete foo\n');
  console.log('    Alias(es):');
  console.log('    d');

}

switch (command) {
  case 'play':
  case 'p':
    playSound(argv);
    break;
  case 'add':
  case 'a':
    addSound(argv);
    break;
  case 'delete':
  case 'd':
    deleteSound(argv);
    break;
  case 'list':
  case 'l':
  case 'ls':
    listSounds();
    break;
  case 'help':
  default:
    printManual();
    break;
}
