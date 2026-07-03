require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDb = require('../src/libs/mongoose');
const Product = require('../src/components/products/model');
const User = require('../src/components/users/model');

const PRODUCTS = [
  { sku: 'BEB-001', nombre: 'Agua Mineral 500ml', categoria: 'Bebidas', precio: 1500, stockActual: 150, stockMinimo: 50, proveedor: 'Distribuidora Andina' },
  { sku: 'BEB-002', nombre: 'Jugo de Naranja 1L', categoria: 'Bebidas', precio: 3200, stockActual: 30, stockMinimo: 40, proveedor: 'Lácteos del Valle' },
  { sku: 'LAC-001', nombre: 'Leche Entera 1L', categoria: 'Lácteos', precio: 2100, stockActual: 200, stockMinimo: 60, proveedor: 'Lácteos del Valle' },
  { sku: 'LAC-002', nombre: 'Yogur Natural 500g', categoria: 'Lácteos', precio: 2800, stockActual: 15, stockMinimo: 25, proveedor: 'Lácteos del Valle' },
  { sku: 'SNA-001', nombre: 'Papas Fritas 200g', categoria: 'Snacks', precio: 2500, stockActual: 80, stockMinimo: 30, proveedor: 'SnacksCorp' },
  { sku: 'LIM-001', nombre: 'Detergente 1L', categoria: 'Limpieza', precio: 4500, stockActual: 45, stockMinimo: 20, proveedor: 'Químicos del Sur' },
];

const ADMIN = {
  nombre: 'Admin MercadoExpress',
  email: 'admin@mercadoexpress.com',
  password: 'Admin1234!',
};

async function seedAdmin() {
  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log(`• Admin ya existe: ${ADMIN.email}`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  await User.create({
    nombre: ADMIN.nombre,
    email: ADMIN.email,
    password: await bcrypt.hash(ADMIN.password, salt),
    role: 'admin',
  });

  console.log(`✓ Admin creado: ${ADMIN.email} / ${ADMIN.password}`);
}

async function seedProducts() {
  for (const product of PRODUCTS) {
    const existing = await Product.findOne({ sku: product.sku });
    if (existing) {
      console.log(`• Omitido (ya existe): ${product.sku}`);
      continue;
    }
    await Product.create(product);
    console.log(`✓ Creado: ${product.sku}`);
  }

  const alertService = require('../src/components/alerts/service');
  const products = await Product.find();
  for (const product of products) {
    await alertService.evaluateAfterStockChange(product, product.stockActual);
  }
}

async function seed() {
  await connectDb();
  await seedAdmin();
  await seedProducts();
  console.log('✓ Seed completado');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('✗ Error en seed:', error);
    process.exit(1);
  });
