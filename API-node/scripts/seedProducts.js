// scripts/seedProducts.js
import Category from '../src/models/category.js';
import Product from '../src/models/product.js';

const IMG = (text) =>
  `https://placehold.co/800x600.png?text=${encodeURIComponent(text)}`;

// TODO: aquí mete TODOS los productos que ya tenías.
// Te dejo algunos de ejemplo con la misma estructura:
const ITEMS = [
  // Design System
  {
    name: 'Design System Starter (Plantilla Figma)',
    price: 2200,
    stock: 999,
    categoryName: 'Design System',
    description: 'Librería base en Figma con tokens, estilos y checklist AA.',
    image: IMG('Design System'),
  },
  {
    name: 'Design System Pro (a medida)',
    price: 14000,
    stock: 100,
    categoryName: 'Design System',
    description: 'Auditoría 10–15 pantallas y handoff.',
    image: IMG('Design System Pro'),
  },
  {
    name: 'Governance & Adoption Workshop (½ día)',
    price: 7500,
    stock: 100,
    categoryName: 'Design System',
    description: 'Reglas, versionado y roles.',
    image: IMG('DS Governance'),
  },

  // Branding
  {
    name: 'BR-PL-001 · Brandbook Express',
    price: 1900,
    stock: 999,
    categoryName: 'Branding',
    description: 'Documento editable con paleta y guía.',
    image: IMG('Brandbook'),
  },

  // 🔽 AQUÍ puedes seguir pegando el resto de ITEMS que ya tenías 🔽
  // ...
];

export async function seedProducts() {
  try {
    console.log('🔄 Seeding products...');

    // Obtener categorías existentes
    const categories = await Category.find({}).select('_id name');
    const catMap = new Map(categories.map((c) => [c.name, c._id]));

    if (!categories.length) {
      console.warn('⚠️ No hay categorías en la DB. Seeding de productos omitido.\n');
      return;
    }

    let upserted = 0;

    for (const item of ITEMS) {
      const catId = catMap.get(item.categoryName);
      if (!catId) {
        console.warn(
          `⚠️ Sin categoría "${item.categoryName}". Omitido: ${item.name}`
        );
        continue;
      }

      await Product.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            name: item.name,
            description: item.description,
            price: item.price,
            stock: item.stock,
            imagesUrl: [item.image],
            category: catId,
          },
        },
        { upsert: true, new: true, runValidators: true }
      );

      upserted++;
    }

    const totalProducts = await Product.countDocuments({});
    console.log(
      `🎉 Productos upserted: ${upserted} | Total en DB: ${totalProducts}\n`
    );
  } catch (err) {
    console.error('❌ Error en seedProducts:', err);
  }
}
