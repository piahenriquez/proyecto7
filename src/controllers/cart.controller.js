const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

const stripeKey = process.env.STRIPE_KEY;
let stripe = null;
if (stripeKey) stripe = require('stripe')(stripeKey);

const resolveCartId = userCart => {
  if (!userCart) return null;
  if (typeof userCart === 'string') return userCart;
  if (userCart._id) return userCart._id;
  return userCart;
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // VALIDAR STOCK
    let user = await User.findById(userId).populate('cart');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (!user.cart) {
      const newCart = await Cart.create({ products: [] });
      user.cart = newCart._id;
      await user.save();
      user = await User.findById(userId).populate('cart');
    }

    const cartId = resolveCartId(user.cart);
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const existing = cart.products.find(p => {
      try {
        return p.product && p.product.toString() === productId;
      } catch (e) {
        return false;
      }
    });

    if (existing) {
      // Validar que no exceda el stock al aumentar cantidad
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          message: `No hay suficiente stock. Máximo disponible: ${product.stock}` 
        });
      }
      existing.quantity = newQuantity;
    } else {
      // Validar que la cantidad inicial no exceda el stock
      if (quantity > product.stock) {
        return res.status(400).json({ 
          message: `No hay suficiente stock. Máximo disponible: ${product.stock}` 
        });
      }
      
      cart.products.push({
        product: productId,
        quantity,
        price: product.price,
        priceID: product.priceID || '',
        name: product.name,
        img: product.image,
        image: product.image,
        slug: product.slug || ''
      });

    }

    await cart.save();
    await cart.populate('products.product');
    
    res.json({ message: 'Producto agregado al carrito', cart });

  } catch (error) {
    console.error('ERROR en addToCart:', error);
    res.status(500).json({
      message: 'Error al agregar al carrito',
      error: error.message
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: 'cart',
      populate: { path: 'products.product' }
    });
    
    if (!user || !user.cart) {
      return res.json({ cart: { products: [] } });
    }
    
    res.json({ cart: user.cart });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener carrito', 
      error: error.message 
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.body.productId || req.query.productId || req.params.productId;
    const userId = req.user.id;

    const user = await User.findById(userId).populate('cart');
    if (!user || !user.cart) return res.status(404).json({ message: 'Usuario o carrito no encontrado' });

    const cartId = resolveCartId(user.cart);
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const existing = cart.products.find(p => {
      try {
        return p.product && p.product.toString() === productId;
      } catch (e) {
        return false;
      }
    });

    if (!existing) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });

    if (existing.quantity > 1) {
      existing.quantity -= 1;
    } else {
      cart.products = cart.products.filter(p => p.product.toString() !== productId);
    }

    await cart.save();
    await cart.populate('products.product');
    
    res.json({ message: 'Producto actualizado/eliminado del carrito', cart });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error al eliminar del carrito', 
      error: error.message 
    });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ message: 'Stripe no configurado' });

    const userId = req.user.id;
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    const foundCart = await Cart.findById(resolveCartId(foundUser.cart)).populate({ 
      path: 'products.product' 
    });

    if (!foundCart || !foundCart.products.length) {
      return res.status(400).json({ message: 'Carrito vacío' });
    }

    console.log('🎯 Productos en el carrito:', foundCart.products); // ← AÑADE ESTO PARA DEBUG

    const defaultCurrency = process.env.STRIPE_CURRENCY || 'clp';
    const zeroDecimalCurrencies = ['clp', 'jpy', 'vnd'];
    const forceInline = process.env.STRIPE_FORCE_INLINE === 'true';

    const line_items = foundCart.products.map(item => {
      const prod = item.product || {};

      
      const image = item.image || item.img || prod.image || prod.img || undefined;
      const name = item.name || prod.name || 'Producto sin nombre';
      const description = item.description || prod.description || '';
      const unitPrice = item.price || prod.price || 0;
      const currency = (item.currency || prod.currency || defaultCurrency).toLowerCase();
      const multiplier = zeroDecimalCurrencies.includes(currency) ? 1 : 100;

      console.log('📦 Procesando item para Stripe:', { name, unitPrice, currency, priceID: item.priceID || prod.priceID });

      const hasPriceId = !!(item.priceID || prod.priceID);
      
      if (!forceInline && hasPriceId) {
        return {
          price: item.priceID || prod.priceID,
          quantity: item.quantity || 1
        };
      }

      
      return {
        price_data: {
          currency,
          product_data: {
            name,
            description,
            images: image ? [image] : []
          },
          unit_amount: Math.round(unitPrice * multiplier)
        },
        quantity: item.quantity || 1
      };
    });

    console.log('✅ Line items enviados a Stripe:', line_items); // ← DEBUG

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      customer_email: foundUser.email,
      metadata: {
        userId: userId.toString(),
        cartId: foundCart._id.toString()
      }
    });

    res.json({ session_url: session.url, session });

  } catch (error) {
    console.error('createCheckoutSession error:', error);
    res.status(500).json({ 
      message: 'Error creando sesión de pago', 
      error: error.message 
    });
  }
};

exports.editCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Products debe ser un arreglo' });
    }

    // VALIDAR STOCK PARA CADA PRODUCTO
    for (let item of products) {
      const product = await Product.findById(item._id || item.product);
      if (product && item.quantity > product.stock) {
        return res.status(400).json({ 
          message: `No hay suficiente stock para ${product.name}. Máximo: ${product.stock}` 
        });
      }
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      resolveCartId(foundUser.cart), 
      { products }, 
      { new: true }
    ).populate({ path: 'products.product' });

    res.json({ message: 'Tu carrito fue actualizado', updatedCart });
    
  } catch (error) {
    console.error('editCart error:', error);
    res.status(500).json({ 
      message: 'Error actualizando carrito', 
      error: error.message 
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // VALIDAR STOCK
    const product = await Product.findById(productId);
    if (product && quantity > product.stock) {
      return res.status(400).json({ 
        message: `No hay suficiente stock. Máximo disponible: ${product.stock}` 
      });
    }

    const user = await User.findById(userId).populate('cart');
    if (!user || !user.cart) {
      return res.status(404).json({ message: 'Usuario o carrito no encontrado' });
    }

    const cart = await Cart.findById(user.cart._id);
    const productIndex = cart.products.findIndex(
      p => p.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    if (quantity <= 0) {
      cart.products.splice(productIndex, 1);
    } else {
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('products.product');

    res.json({
      message: 'Cantidad actualizada correctamente',
      cart
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error actualizando cantidad',
      error: error.message
    });
  }
};

// Función adicional para limpiar carrito 
exports.forceClearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const foundUser = await User.findById(userId);
    
    if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    const clearedCart = await Cart.findByIdAndUpdate(
      resolveCartId(foundUser.cart), 
      { products: [] }, 
      { new: true }
    );

    res.json({ message: 'Carrito limpiado completamente', cart: clearedCart });
    
  } catch (error) {
    console.error('forceClearCart error:', error);
    res.status(500).json({ 
      message: 'Error limpiando carrito', 
      error: error.message 
    });
  }
};