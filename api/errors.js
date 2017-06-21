module.exports = {
	getNotFoundError: function() {
		return {error: 1, description: "Nada encontrado"};
	},

	getNicknameAlreadyInUse: function() {
		return {error: 2, description: "Este nome de usuário já está cadastrado"};
	},

	getWrongLogin: function() {
		return {error: 3, description: "Login ou senha inválidos"};
	},

	getUnauthorized: function() {
		return {error: 4, description: "Acesso não autorizado."};
	}
}