const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try{
    body = JSON.parse(event.body);
    const response = await fetch('https://transformer.huggingface.co/autocomplete/gpt2/xl', {
      method: 'post',
      mode: 'cors',
      redirect: 'follow',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        "context": body.data, 
        "model_size":"gpt2/xl",
        "top_p":0.9,
        "temperature":1,
        "max_time":1 })
    });
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ "response": data.sentences[0].value })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
};
