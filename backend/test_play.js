const play = require('play-dl');

async function test() {
  const url = process.argv[2] || 'https://youtu.be/r60cYFLy3-I';
  console.log('Testing URL:', url);
  try {
    const info = await play.video_info(url);
    console.log('SUCCESS!');
    console.log('Title:', info.video_details.title);
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

test();
