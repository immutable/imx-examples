function random() {
  const min = 1;
  const max = 1000000000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

module.exports = {
  random: random
};