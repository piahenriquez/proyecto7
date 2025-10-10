const User = require("../models/User");
const Cart = require("../models/Cart");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let foundUser = await User.findOne({ email });
    if (foundUser)
      return res.status(400).json({ message: "El usuario ya existe" });
    
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newCart = await Cart.create({});

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      cart: newCart._id
    });
    
    if (!newUser)
      return res.status(400).json({ error: "No se pudo registrar el usuario" });
    
    return res.status(201).json({ datos: newUser });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error al registrar el usuario",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(400).json({ message: "El usuario no existe" });

    const correctPassword = await bcryptjs.compare(
      password,
      foundUser.password
    );

    if (!correctPassword)
      return res
        .status(400)
        .json({ message: "El email o contrasena no corresponden" });

    const payload = {
      user: {
        id: foundUser._id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: "1d",
      },
      (error, token) => {
        if (error) throw error;

        const isProd = process.env.NODE_ENV === 'production';
        res
          .cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None': 'Lax',
            maxAge: 24 * 60 * 60 * 1000
          })
          .json({ msg: 'Login exitoso' })
      }
    );
  } catch (error) {
    res.json({
      message: "Hubo un error al obtener el token",
      error,
    });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ usuario: user });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error",
      error,
    });
  }
};

exports.updateUser = async (req, res) => {
  const newUser = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      newUser,
      { new: true }
    ).select('-password');

    res.json({
      message: 'usuario actualizado con exito',
      data: updatedUser
    })
  } catch (error) {
     console.error(error);
     res.status(500).json({
      message: 'Hubo un error actualizando el usuario'
     })
  }
}

exports.logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  })
  return res.json({ message: 'Logout exitoso' })
}