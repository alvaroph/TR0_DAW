
const NPREGUNTAS=3

let estatDeLaPartida = { 
    contadorPreguntes: 0, 
    respostesUsuari: [] // Aquí anirem guardant les respostes 
}; 

function actualitzaMarcador() {
    let marcador = document.getElementById("marcador");
    let htmlString= `Preguntes respostes ${estatDeLaPartida.contadorPreguntes}/${NPREGUNTAS} <br>`
    for (let i=0; i< estatDeLaPartida.respostesUsuari.length ; i++)
    {
        htmlString+= `Pregunta  ${i} : <span class='badge text-bg-primary'> 
                            ${(estatDeLaPartida.respostesUsuari[i]==undefined?"O":"X")}
                            </span><br>` 

    }
    marcador.innerHTML =htmlString;
   
}
//AQUESTA FUNCIO REACCCIONA A QUAN UN USUARI MARCA UN BOTO (PREGUNTA I RESPOSTA)
function marcarRespuesta(numPregunta, numRespuesta) {
    console.log("Pregunta " + numPregunta + " Resposta " + numRespuesta);
   
    if (estatDeLaPartida.respostesUsuari[numPregunta]==undefined){
    estatDeLaPartida.contadorPreguntes++;
        if (estatDeLaPartida.contadorPreguntes==NPREGUNTAS){
            document.getElementById("btnEnviar").style.display="block"
        }
    }
    estatDeLaPartida.respostesUsuari[numPregunta] = numRespuesta;
    console.log(estatDeLaPartida)
    actualitzaMarcador();
}

function imprimirJuego(data){
    let contenidor=document.getElementById("questionari");

        let htmlString="";

     
    for (let i=0; i<NPREGUNTAS; i++) {
            htmlString+=`<h3> ${data.preguntes[i].pregunta} </h3> `;
            htmlString+=`<img src="img/${data.preguntes[i].imatge}" alt="imatge pregunta ${i+1}"> <br>`;

            for (let j=0; j < data.preguntes[i].respostes.length ; j++){
                htmlString+=`<button preg="${i}" resp="${j}" class="btn btn-primary"> 
                                ${data.preguntes[i].respostes[j].resposta} 
                            </button> `;
            }
        }

       //DELEGACIO D'EVENTS
       //FEM QUE ESCOLTI EL PARE I DESPRES AMB UN IF VEIEM SI ENS INTERESA QUI HA FET CLICK
       //DESPRES RECUPEREM LA INFORMACIO DEL e.target 
        contenidor.addEventListener('click', function(e) {
          console.log("han clickado a " + e.target)
          if(e.target.classList.contains('btn')){
             console.log("esto si es un boton que tiene los datos" + e.target.getAttribute("preg") +"--"+ e.target.getAttribute("resp"))
              marcarRespuesta(e.target.getAttribute("preg"),e.target.getAttribute("resp"))
            }
          });

        htmlString+=`<button id="btnEnviar"  class="btn btn-danger"  style="display:none" >Enviar Respuestas</button>`
            
        contenidor.innerHTML=htmlString;

      document.getElementById("btnEnviar").addEventListener("click", function(){
         const url = "recollida.php"; // cambia por tu endpoint
            // 1) Enviar como JSON
            fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contadorPreguntes: estatDeLaPartida.contadorPreguntes,
                respostesUsuari: estatDeLaPartida.respostesUsuari
              })
            })
            .then(res => res.text())
            .then(data => console.log("JSON ->", data));

            // 2) Enviar como FormData (simulando formulario multipart)
            let formData = new FormData();
            formData.append("contadorPreguntes", estatDeLaPartida.contadorPreguntes);
            formData.append("respostesUsuari", JSON.stringify(estatDeLaPartida.respostesUsuari));

            fetch(url, {
              method: "POST",
              body: formData
            })
            .then(res => res.text())
            .then(data => console.log("FormData ->", data));

            // 3) Enviar como x-www-form-urlencoded
            let params = new URLSearchParams();
            params.append("contadorPreguntes", estatDeLaPartida.contadorPreguntes);
            params.append("respostesUsuari", JSON.stringify(estatDeLaPartida.respostesUsuari));

            fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: params
            })
            .then(res => res.text())
            .then(data => console.log("URLEncoded ->", data));
      })

 }

window.addEventListener('DOMContentLoaded', (event) => {

    fetch('js/data.json')
        .then(response => response.json())
      .then(data => imprimirJuego(data));

       
});


function enviarEstat() {
 
}