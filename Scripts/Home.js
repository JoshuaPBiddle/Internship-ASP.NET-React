
function XMLAlert(event) {
    event.preventDefault();

    var textInput = document.getElementById("textBox").value;
    var request = new XMLHttpRequest(),
        method = "POST",
        url = "/Text/AddTextRow";

    request.open(method, url, false);
    request.setRequestHeader("Content-Type", "application/json");

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var status = request.status;
            if (status === 0 || (status >= 200 && status < 400)) { //200s = success, 300s = redirect
                //alert("request was successful"); 

                //var success = document.getElementById("success");  div insertion
                //success.innerText = "Request was successful"; div insertion

                var form = document.forms[0];
                var successDivs = form.querySelectorAll(".success");
                for (var successDiv of successDivs) {
                    form.removeChild(successDiv);
                }
               
                var success = document.createElement("div");
                success.innerText = "Request was successful";
                success.className = "success";
                form.appendChild(success);
            }
        }
    };

    //var dbEntry = "{TextInput: '" + textInput + "'}";
    var dbEntry = JSON.stringify({ TextInput: textInput });
    request.send(dbEntry);
}

document.forms[0].addEventListener('submit', XMLAlert);
