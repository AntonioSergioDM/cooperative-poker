const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '/../public/images/cards/modern/Modern');

// Map the abbreviations to the full names
const faceCardMap = {
  '01': 'Ace',
  '13': 'King',
  '12': 'Queen',
  '11': 'Jack',
  '10': '10',
  '09': '9',
  '08': '8',
  '07': '7',
  '06': '6',
  '05': '5',
  '04': '4',
  '03': '3',
  '02': '2',
  'Joker': 'Joker',
};

const suitCardMap = {
  'c': 'Clubs',
  'd': 'Diamonds',
  'h': 'Hearts',
  's': 'Spades',
};

if (!fs.existsSync(targetDir)) {
  console.error(`Error: Directory not found: ${targetDir}`);
  process.exit(1);
}

Object.keys(suitCardMap).forEach(suit => {
  Object.keys(faceCardMap).forEach(val => {

    const oldName = `/${suit}${val}.png`;
    const newName = `/${suitCardMap[suit]}${faceCardMap[val]}.png`;

    const oldPath = path.join(targetDir, oldName);
    const newPath = path.join(targetDir, newName);

    // Check if the file exists before trying to rename it
    if (fs.existsSync(oldPath)) {
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${oldName} -> ${newName}`);
      } catch (err) {
        console.error(`Error renaming ${oldName}:`, err.message);
      }
    }
  });
});

console.log('Finished processing files.');
