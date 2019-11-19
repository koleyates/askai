let question, buffer = "";
document.getElementById("form").addEventListener('submit', function (event) {
  event.preventDefault();
  question = document.getElementById("question").value;
  if (!question.endsWith("?")) {
    question += "?";
  }
  buffer = question;
  getData(question);
  return false;
});

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementsByClassName("si-mic")[0].addEventListener("click", function (e) {
    let qbox = document.getElementById("question");
    if (document.getElementById("question").value.length > 0) {
      document.getElementById("question").value = "";
    }
  });
});

function getData(data) {
  document.getElementById("loading").classList.remove("hidden");
  data = "Q: " + data + "\n";
  fetch('/api/data', {
    method: 'post',
    mode: 'cors',
    redirect: 'follow',
    headers: {
      'Accept': 'application/json',
      'Content-Type': "application/json; charset=UTF-8"
    },
    body: JSON.stringify({ "data": data })
  }).then(function (response) {
    return response.json();
  }).then(function (jsonData) {
    answer = jsonData.response;
    buffer = buffer + answer;

    //clean up some bad formatting
    buffer = buffer.replace(" . ", ".");
    buffer = buffer.replace(" .", ".");
    buffer = buffer.replace(" , ", ", ");
    buffer = buffer.replace(" , ", ", ");
    buffer = buffer.replace(" '", "'");
    buffer = buffer.replace(" \" ", " \"");

    document.getElementById("response").textContent = buffer.split("A:")[1];
    if (!answer.trim().endsWith(".")
      && !answer.trim().endsWith("!")
      && !answer.trim().endsWith("?")) {
      console.log(answer);
      getData(buffer);
    } else {
      speak(buffer);
      console.log(buffer);
      document.getElementById("loading").classList.add("hidden");
    }

  }).catch(function (err) {
    console.log("Oops, Something went wrong!", err);
  })
}
function speak(answer) {
  if (answer.includes("A:")) {
    answer = answer.split("A:")[1];
  }
  var utterance = new SpeechSynthesisUtterance(answer);
  var voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.filter(function (voice) { return voice.name == 'Google UK English Male'; })[0];
  window.speechSynthesis.speak(utterance);
}
