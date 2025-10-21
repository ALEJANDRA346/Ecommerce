// scripts/seedProducts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/category.js';
import Product from '../src/models/product.js';

dotenv.config();

const { MONGODB_URI, MONGODB_DB } = process.env;
const IMG = (text) => `https://placehold.co/800x600.png?text=${encodeURIComponent(text)}`;

// 1) Upsert de CATEGORÍAS (10 nombres exactos)
const CATEGORY_DOCS = [
  { name: "Design System",    description: "Sistemas de diseño y librerías de UI",            imageURL: IMG("Design System"),    parentCategory: null },
  { name: "Branding",         description: "Identidad visual, logo y brandbook",              imageURL: IMG("Branding"),         parentCategory: null },
  { name: "Video",            description: "Edición, motion graphics y teasers",              imageURL: IMG("Video"),            parentCategory: null },
  { name: "Programación",     description: "APIs, automatizaciones e integraciones",          imageURL: IMG("Programación"),     parentCategory: null },
  { name: "Data & Analytics", description: "Dashboards, KPIs y BI",                           imageURL: IMG("Data & Analytics"), parentCategory: null },
  { name: "Administración",   description: "Operaciones, soporte y mantenimiento",            imageURL: IMG("Administración"),   parentCategory: null },
  { name: "UX/UI",            description: "Investigación, wireframes y prototipos",          imageURL: IMG("UX/UI"),            parentCategory: null },
  { name: "Consultoría",      description: "Estrategia y asesorías",                          imageURL: IMG("Consultoría"),      parentCategory: null },
  { name: "Marketing",        description: "Campañas, copies, calendarios y performance",     imageURL: IMG("Marketing"),        parentCategory: null },
  { name: "Capacitación",     description: "Workshops, entrenamientos y playbooks operativos", imageURL: IMG("Capacitación"),     parentCategory: null },
];

// 2) Catálogo (30 ítems)
const ITEMS = [
  // Design System
  { name: "DS-PL-001 · Design System Starter (Plantilla Figma)", price: 2200,  stock: 999, categoryName: "Design System",
    description: "Librería base en Figma con tokens, estilos y checklist AA.", image: IMG("Design System") },
  { name: "DS-SV-002 · Design System Pro (a medida)",            price: 14000, stock: 100, categoryName: "Design System",
    description: "Auditoría 10–15 pantallas, librería custom y handoff a devs.", image: IMG("Design System Pro") },
  { name: "DS-SV-003 · Governance & Adoption Workshop (½ día)",  price: 7500,  stock: 100, categoryName: "Design System",
    description: "Reglas, versionado, roles y plan de adopción del DS.", image: IMG("DS Governance") },

  // Branding
  { name: "BR-PL-001 · Brandbook Express (Plantilla + Guía)",    price: 1900,  stock: 999, categoryName: "Branding",
    description: "Documento editable con identidad, paleta, tipografías y usos.", image: IMG("Brandbook") },
  { name: "BR-SV-002 · Logo & Assets Startup Pack",              price: 6000,  stock: 100, categoryName: "Branding",
    description: "Logo principal/alternos, favicon y guía corta de uso.", image: IMG("Logo Pack") },
  { name: "BR-SV-003 · Rebranding Workshop (½ día)",             price: 6800,  stock: 100, categoryName: "Branding",
    description: "Taller con stakeholders y plan de transición de marca.", image: IMG("Rebranding") },

  // Video
  { name: "VD-PL-001 · Plantillas Promo (3 templates AE/CapCut)", price: 1300,  stock: 999, categoryName: "Video",
    description: "Intro, teaser 30s y bumper + tutorial de personalización.", image: IMG("Video Templates") },
  { name: "VD-SV-002 · Explainer 60s con Motion",                 price: 9000,  stock: 100, categoryName: "Video",
    description: "Guion, storyboard, animación y export para RRSS.", image: IMG("Explainer") },
  { name: "VD-SV-003 · Edición mensual RRSS (4–8 clips)",         price: 6500,  stock: 100, categoryName: "Video",
    description: "Paquete mensual de clips optimizados por plataforma.", image: IMG("RRSS Edición") },

  // Programación
  { name: "PR-PL-001 · API Express Boilerplate (CRUD+Auth+Swagger)", price: 2400, stock: 999, categoryName: "Programación",
    description: "Estructura por capas con JWT, validaciones y Swagger.", image: IMG("API Boilerplate") },
  { name: "PR-SV-002 · Implementación de API + Integración",         price: 12000, stock: 100, categoryName: "Programación",
    description: "Endpoints clave, seguridad y conexión a DB/servicios.", image: IMG("API Integración") },
  { name: "PR-SV-003 · Automatizaciones & Webhooks Pack",            price: 7500,  stock: 100, categoryName: "Programación",
    description: "Flujos Zapier/Make y scripts a medida.", image: IMG("Automations") },

  // Data & Analytics
  { name: "DA-PL-001 · Dashboard KPI (Excel/Looker Studio)",     price: 1700,  stock: 999, categoryName: "Data & Analytics",
    description: "Plantilla de métricas estándar + guía de conexión.", image: IMG("Dashboard KPI") },
  { name: "DA-SV-002 · Auditoría de Tracking (GA4/Tag Manager)", price: 7500,  stock: 100, categoryName: "Data & Analytics",
    description: "Revisión de eventos y plan de corrección.", image: IMG("Tracking Audit") },
  { name: "DA-SV-003 · Diccionario de Métricas & Eventos",       price: 4500,  stock: 100, categoryName: "Data & Analytics",
    description: "Definiciones canónicas, naming y ownership.", image: IMG("Metric Dictionary") },

  // Administración
  { name: "AD-PL-001 · Kits de Excel Operativos (Bundle 4)",     price: 2400,  stock: 999, categoryName: "Administración",
    description: "Presupuesto, gastos, CRM simple y pipeline ventas.", image: IMG("Excel Kits") },
  { name: "AD-SV-002 · Operaciones PMO Lite (Mensual)",          price: 6500,  stock: 100, categoryName: "Administración",
    description: "Calendario, tableros, check-ins y reportes.", image: IMG("PMO Lite") },
  { name: "AD-SV-003 · Implementación de SOPs + Entrenamiento",  price: 5500,  stock: 100, categoryName: "Administración",
    description: "Redacción, adopción y capacitación de procesos.", image: IMG("SOPs") },

  // UX/UI
  { name: "UX-PL-001 · Wireframe Kit (Figma)",                   price: 1200,  stock: 999, categoryName: "UX/UI",
    description: "Componentes low-fi para login/onboarding/listing/checkout.", image: IMG("Wireframe Kit") },
  { name: "UX-SV-002 · Prototipo Navegable (1 flujo)",           price: 6500,  stock: 100, categoryName: "UX/UI",
    description: "De idea a prototipo clickable + handoff.", image: IMG("Prototipo") },
  { name: "UX-SV-003 · Test de Usabilidad Rápido (5 usuarios)",  price: 8000,  stock: 100, categoryName: "UX/UI",
    description: "Guion, sesiones remotas y quick wins.", image: IMG("Usability Test") },

  // Consultoría
  { name: "CT-SV-001 · Diagnóstico 90’ (Discovery + Report)",    price: 2400,  stock: 100, categoryName: "Consultoría",
    description: "Priorización, quick wins y roadmap corto.", image: IMG("Diagnóstico") },
  { name: "CT-SV-002 · Mentoría 5 horas",                        price: 4800,  stock: 100, categoryName: "Consultoría",
    description: "Acompañamiento en diseño/producto/data/dev.", image: IMG("Mentoría") },
  { name: "CT-SV-003 · Roadmap Sprint (2 semanas)",              price: 12000, stock: 100, categoryName: "Consultoría",
    description: "Objetivos, backlog priorizado y plan de ejecución.", image: IMG("Roadmap Sprint") },

  // Marketing (nueva)
  { name: "MK-PL-001 · Calendario Editorial + Kit Copy (Plantilla)", price: 1400, stock: 999, categoryName: "Marketing",
    description: "Plantillas de calendario, prompts y matrices de copy.", image: IMG("Calendario Editorial") },
  { name: "MK-SV-002 · Campaña Performance Sprint (2 semanas)",      price: 9500, stock: 100, categoryName: "Marketing",
    description: "Set up, creatividades, pruebas A/B y optimización.", image: IMG("Performance Sprint") },
  { name: "MK-SV-003 · Auditoría de Canales & Benchmarks",           price: 5200, stock: 100, categoryName: "Marketing",
    description: "Revisión de canales, CAC/LTV y recomendaciones.", image: IMG("Marketing Audit") },

  // Capacitación (nueva)
  { name: "TR-PL-001 · Playbook de Onboarding (Plantilla)",          price: 1600, stock: 999, categoryName: "Capacitación",
    description: "Guía de onboarding con roles, checklists y métricas.", image: IMG("Onboarding Playbook") },
  { name: "TR-SV-002 · Taller In-Company 4h (tema a elegir)",        price: 7000, stock: 100, categoryName: "Capacitación",
    description: "Workshop práctico con materiales y ejercicios.", image: IMG("Taller In-Company") },
  { name: "TR-SV-003 · Programa de Mentoring (4 semanas)",           price: 11500, stock: 100, categoryName: "Capacitación",
    description: "Acompañamiento semanal con plan de acción.", image: IMG("Mentoring") },
];

async function main() {
  await mongoose.connect(`${MONGODB_URI}/${MONGODB_DB}`);
  console.log('✅ DB conectada');

  // Upsert categorías
  for (const cat of CATEGORY_DOCS) {
    await Category.findOneAndUpdate(
      { name: cat.name },
      { $set: cat },
      { upsert: true, new: true, runValidators: true }
    );
  }
  const cats = await Category.find({ name: { $in: CATEGORY_DOCS.map(c => c.name) } }).select('_id name');
  console.log('📁 Categorías activas:', cats.map(c => c.name).join(', '));

  const catMap = new Map(cats.map(c => [c.name, c._id]));

  // Upsert productos
  let inserted = 0;
  for (const item of ITEMS) {
    const catId = catMap.get(item.categoryName);
    if (!catId) {
      console.warn(`⚠️  Falta categoría "${item.categoryName}". Omitido: ${item.name}`);
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
        }
      },
      { upsert: true, new: true, runValidators: true }
    );
    inserted++;
  }

  const totalCats = await Category.countDocuments({ name: { $in: CATEGORY_DOCS.map(c => c.name) } });
  const totalProducts = await Product.countDocuments({});
  console.log(`✅ Categorías (esperadas 10): ${totalCats}`);
  console.log(`🎉 Productos upserted: ${inserted} | Total en DB: ${totalProducts}`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
