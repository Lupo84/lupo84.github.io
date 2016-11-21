var palabra, letras;
var hombre;

// Declaración de la clase
var Ahorcado = function(con) {
	this.contexto = con;
	this.maximo = 5;
	this.intentos = 0;
	this.vivo = true;
	this.imagenURL = ['img/rostro2.fw.png','img/tronco2.fw.png','img/brazos2.fw.png','img/piernas2.fw.png','img/ahorcado2.fw.png'];
	this.imagenOK = [false, false, false, false, false];

	this.fondoURL = 'img/gallows.jpg';
	this.fondoOK = false;

	this.dibujar();
}

Ahorcado.prototype.dibujar = function () {
	var dibujo = this.contexto;

	if (this.fondoOK) {
		dibujo.drawImage(this.fondo, 0, 0);
	}

	// Dibujar Rostro
	if(this.intentos > 0){
		if(this.imagenOK[0]){
			dibujo.drawImage(this.imagen[0], 590, 60);
		}

		// Dibujar Dorso
		if(this.intentos > 1){
			if(this.imagenOK[1]){
				dibujo.drawImage(this.imagen[1], 590, 60);
			}
		
			// Dibujar Brazos
			if(this.intentos > 2){
				if(this.imagenOK[2]){
					dibujo.drawImage(this.imagen[2], 585, 60);
				}
			
				// Dibujar Piernas
				if(this.intentos > 3){
					if(this.imagenOK[3]){
						dibujo.drawImage(this.imagen[3], 585, 60);
					}
				
					// Dibujar Ojos Muertos
					if(this.intentos > 4){
						if(this.imagenOK[4]){
							dibujo.drawImage(this.imagen[4], 584, 60);
						}
					}
				}
			}
		}
	}
}

Ahorcado.prototype.trazar = function () {
	this.intentos++;
	if (this.intentos >= this.maximo) {
		this.vivo = false;
		alert('Estas Muerto :(');
		document.getElementById('letra').disabled = true;
	}
	this.dibujar();
}

function confirmarAhorcado() {
	hombre.imagenOK = [true, true, true, true, true];
}

function confirmarFondo() {
	hombre.fondoOK = true;
	hombre.dibujar();
}

function iniciar() {
	palabra = prompt('¿Cual será la palabra a adivinar?','');
	palabra = palabra.toUpperCase();

	letras = document.getElementById('pista');
	for (var i = palabra.length - 1; i >= 0; i--) {
		letras.innerHTML += '_ ';
	}

	var boton = document.getElementById('boton');
	boton.addEventListener('click', revisa);
	
	document.addEventListener("keydown",function(e){
		if(e.keyCode == 13){
			revisa();
		}
	});

	var canvas = document.getElementById('c');
	canvas.width = 800;
	canvas.height = 450;
	// Para Canvas 3D - canvas.getContext("webgl");
	var contexto = canvas.getContext('2d');
	hombre = new Ahorcado(contexto);

	hombre.fondo = new Image();
	hombre.fondo.src = hombre.fondoURL;
	hombre.fondo.onload = confirmarFondo;  

	hombre.imagen = [new Image(), new Image(), new Image(), new Image(), new Image()];
	hombre.imagen[0].src = hombre.imagenURL[0];
	hombre.imagen[0].onload = confirmarAhorcado;
	
	hombre.imagen[1].src = hombre.imagenURL[1];
	hombre.imagen[1].onload = confirmarAhorcado;
	
	hombre.imagen[2].src = hombre.imagenURL[2];
	hombre.imagen[2].onload = confirmarAhorcado;
	
	hombre.imagen[3].src = hombre.imagenURL[3];
	hombre.imagen[3].onload = confirmarAhorcado;

	hombre.imagen[4].src = hombre.imagenURL[4];
	hombre.imagen[4].onload = confirmarAhorcado;

}

function revisa() {

	var texto = document.getElementById('letra');
	var letra = texto.value;
	letra = letra.toUpperCase();
	// Reseteo el campo donde se escribe luego de tomar el valor
	texto.value = '';

	var aciertos = letras.innerHTML;

	// Sin letras seleccionadas
	if(letra.length == 0){
		alert('Debe introducir al menos una letra antes de oprimir el botón');
	// Mas de una letra seleccionada
	}else if(letra.length > 1){
		var seguir = true;
		// Por si se agregaron dos letras sin querer
		seguir = confirm('Usted ha ingresado más de una letra. Está seguro?');

		if(seguir){
			if(letra == palabra){
				alert('EXCELENTE!! Ganaste!');
				texto.disabled = true;

				aciertos = palabra.split('');
				letras.innerHTML = aciertos;
				letras.innerHTML = letras.innerHTML.replace(/\,/g,' ');
			}else{
				hombre.intentos = hombre.maximo;
				hombre.trazar();
			}
		}
	// Una letra seleccionada
	}else if(letra.length == 1){
		// Revisamos si la letra se encuentra y en qué posición
		if(palabra.includes(letra)){
			// Revisamos si la letra ya se había seleccionado
			if(aciertos.includes(letra)){
				hombre.trazar();
			}else{
				aciertos = '';
				for (var i = 0; i < palabra.length; i++){
					if(palabra[i] == letra){
						aciertos += letra + ' ';
					}else{
						// Multiplicamos i*2 porque existe un espacio en blanco entre letras
						aciertos += letras.innerHTML[i*2] + ' ';
					}
				}
				// Tras completar las letras, revisamos si hemos acertado la palabra borrando los espacios en blanco
				if(aciertos.replace(/\s/g,'') == palabra){
					alert('EXCELENTE!! Ganaste!');
					texto.disabled = true;
				}
				letras.innerHTML = aciertos;
			}
		}else{
			hombre.trazar();
		}
	}
}
