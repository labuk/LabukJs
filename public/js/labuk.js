// Function Prioridad
function get_prioridad(prioridad) {
	if (prioridad === 0) {return 'General';}
	if (prioridad === 1) {return 'Esencial';}
	if (prioridad === 2) {return 'Util';}
	if (prioridad === 3) {return 'Laborioso';}
	if (prioridad === 4) {return 'Desechado';}
};

// Function Estado Piece
function get_estado(estado) {
	if (estado === 0) {return 'En cola';}
	if (estado === 1) {return 'En desarrollo';}
	if (estado === 2) {return 'Boceto';}
	if (estado === 3) {return 'Perfilado';}
	if (estado === 4) {return 'Terminado';}
};

// Function Rol
function get_rol(rol) {
	if (rol === 0) {return 'Administrador';}
	if (rol === 1) {return 'Miembro';}
	if (rol === 2) {return 'Colaborador';}
	if (rol === 3) {return 'Seguidor';}
};

// Function Estado Answer
function get_answer(answer) {
	if (answer === 0) {return 'Pendiente revisión';}
	if (answer === 1) {return 'Solución';}
	if (answer === 2) {return 'Error';}
};
