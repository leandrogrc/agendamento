const User = require("../models/User");
const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!confirmPassword || !password)
    return res.status(400).json({ message: "Informe a senha 2 vezes" });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "As senhas devem ser iguais" });

  const checkUser = await User.findOne({ where: { email } });

  if (checkUser) return res.status(404).json({ message: "Usuário já existe" });
  else {
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(8));
    try {
      const newUser = await User.create({ email, password: hashedPassword });
      res.status(201).json({
        message: "Conta criada com sucesso",
        newUser,
      });
    } catch (error) {
      res.status(400).json({
        message: "Erro ao criar usuário",
      });
    }
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Busca o usuário pelo email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // 2. Verifica se a senha fornecida bate com a senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const expiresIn = dayjs().add(7, "days").unix(); // formato UNIX timestamp

    // Gerar token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        exp: expiresIn, // JWT já entende esse formato
      },
      process.env.JWT_SECRET
    );

    // Criar cookie com o mesmo tempo de expiração
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true se estiver com HTTPS
      sameSite: "strict",
      expires: dayjs().add(7, "days").toDate(), // em formato Date para o cookie
    });

    // Se tudo OK, retorne sucesso ou gere token, etc.
    res.json({ message: "Login realizado com sucesso", user });
  } catch (error) {
    res.status(500).json({ error: "Erro no login" });
  }
};
