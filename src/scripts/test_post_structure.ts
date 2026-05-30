import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('https://rest.ensembl.org/variation/human?pops=1', {
      ids: ['rs10456205']
    }, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    console.log(JSON.stringify(res.data['rs10456205'], null, 2).slice(0, 2000));
  } catch (err: any) {
    console.error(err.message);
  }
}

test();
