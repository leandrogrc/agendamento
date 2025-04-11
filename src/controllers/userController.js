const User = require("../models/User");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

exports.updateMyEmail = async (req, res) => {
  const { email } = req.body;
  const userId = req.user?.id; // ID vindo do token decodificado

  if (!email) {
    return res.status(400).json({ message: "E-mail é obrigatório." });
  }

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  // Validação do formato do e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Formato de e-mail inválido." });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Verificar se o e-mail já está em uso por outro usuário
    const existingEmail = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: userId },
      },
    });

    if (existingEmail) {
      return res.status(409).json({ message: "Este e-mail já está em uso." });
    }

    user.email = email;
    await user.save();

    return res
      .status(200)
      .json({ message: "E-mail atualizado com sucesso.", user });
  } catch (error) {
    console.error("Erro ao atualizar e-mail:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao atualizar e-mail." });
  }
};

exports.updateMyPass = async (req, res) => {
  const { currentPass, newPass, confirmNewPass } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (!currentPass || !newPass || !confirmNewPass) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  if (newPass !== confirmNewPass) {
    return res.status(400).json({ message: "As senhas não coincidem." });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await bcrypt.compare(currentPass, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Senha atual incorreta." });
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao atualizar senha." });
  }
};
