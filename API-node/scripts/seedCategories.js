// scripts/seedCategories.js
import Category from '../src/models/category.js';

const IMG = (text) =>
  `https://placehold.co/800x600.png?text=${encodeURIComponent(text)}`;

const CATEGORY_DOCS = [
  {
    name: 'UX/UI',
    description:
      'Templates and systems for designers who create meaningful digital experiences.',
    imageURL: IMG('UX/UI'),
    parentCategory: null,
  },
  {
    name: 'Design',
    description:
      'Creative assets and visual identity kits for professionals who want strong brands.',
    imageURL: IMG('Design'),
    parentCategory: null,
  },
  {
    name: 'Design System',
    description:
      'Design tokens, componentes y librerías para escalar productos digitales.',
    imageURL: IMG('Design System'),
    parentCategory: null,
  },
  {
    name: 'Branding',
    description:
      'Brandbooks, logos y activos visuales para construir marcas sólidas.',
    imageURL: IMG('Branding'),
    parentCategory: null,
  },
  {
    name: 'Administration',
    description:
      'Strategic templates for PMs, freelancers, and teams using SCRUM and agile frameworks.',
    imageURL: IMG('Administration'),
    parentCategory: null,
  },
  {
    name: 'Programming',
    description:
      'Code templates, UI components, and starter projects for modern developers.',
    imageURL: IMG('Programming'),
    parentCategory: null,
  },
  {
    name: 'E-Learning',
    description:
      'Interactive course-building templates for educators and creators.',
    imageURL: IMG('E-Learning'),
    parentCategory: null,
  },
  {
    name: 'AI',
    description:
      'AI-powered templates and workflows using tools like ChatGPT and Copilot.',
    imageURL: IMG('AI'),
    parentCategory: null,
  },
  {
    name: 'Web Tools',
    description:
      'E-commerce and website templates for modern online brands.',
    imageURL: IMG('Web Tools'),
    parentCategory: null,
  },
];

export async function seedCategories() {
  try {
    console.log('🔄 Seeding categories...');

    for (const cat of CATEGORY_DOCS) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        { $set: cat },
        { upsert: true, new: true, runValidators: true }
      );
    }

    const totalCats = await Category.countDocuments({
      name: { $in: CATEGORY_DOCS.map((c) => c.name) },
    });

    console.log(`📁 Categorías generadas/actualizadas: ${totalCats}\n`);
  } catch (err) {
    console.error('❌ Error en seedCategories:', err);
  }
}
