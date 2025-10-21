// src/controllers/categoryController.js
import Category from "../models/category.js";
// import errorHandler from "../middlewares/errorHandler.js"; // (opcional)

async function getCategories(req, res, next) {
  try {
    const categories = await Category.find()
      .populate("parentCategory")
      .sort({ name: 1 });
    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await Category.findById(req.params.id).populate("parentCategory");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, description, parentCategory, imageURL } = req.body;

    // Validación básica
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }

    // Duplicado por nombre (case-insensitive)
    const dup = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" }
    });
    if (dup) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    // Validar parent si se envía
    let parentId = null;
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ error: "parentCategory not found" });
      }
      parentId = parent._id;
    }

    const newCategory = await Category.create({
      name: name.trim(),
      description: description || "",
      parentCategory: parentId,
      imageURL: imageURL || null,
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    return next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { name, description, parentCategory, imageURL } = req.body;
    const idCategory = req.params.id;

    // parentCategory no puede ser el mismo id
    if (parentCategory && parentCategory === idCategory) {
      return res.status(400).json({ error: "parentCategory cannot be the same as the category" });
    }

    // Validar parent si se envía
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ error: "parentCategory not found" });
      }
    }

    // Evitar duplicado de nombre con otros documentos
    if (name && name.trim()) {
      const dup = await Category.findOne({
        _id: { $ne: idCategory },
        name: { $regex: `^${name.trim()}$`, $options: "i" }
      });
      if (dup) {
        return res.status(400).json({ error: "Category name already exists" });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      idCategory,
      {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(imageURL !== undefined ? { imageURL } : {}),
        ...(parentCategory !== undefined ? { parentCategory: parentCategory || null } : {}),
      },
      { new: true, runValidators: true } // <-- importante
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const idCategory = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(idCategory);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function searchCategory(req, res, next) {
  try {
    const { q, parentCategory, sort, order, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (parentCategory) {
      filters.parentCategory = parentCategory;
    }

    const sortOptions = {};
    if (sort) {
      const sortOrder = order === "desc" ? -1 : 1;
      sortOptions[sort] = sortOrder;
    } else {
      sortOptions.name = -1;
    }

    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 10;
    const skip = (p - 1) * l;

    const [categories, totalResults] = await Promise.all([
      Category.find(filters)
        .populate("parentCategory")
        .sort(sortOptions)
        .skip(skip)
        .limit(l),
      Category.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalResults / l);

    return res.status(200).json({
      categories,
      pagination: {
        currentPage: p,
        totalPages,
        totalResults,
        hasNext: p < totalPages,
        hasPrev: p > 1, // <-- fix
      },
      searchTerm: q || null,
      parentCategory: parentCategory || null,
      sort: sort || 'name',
      order: order || 'desc'
    });
  } catch (error) {
    return next(error);
  }
}

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory
};
