function CategoryTabs({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="mx-auto mt-8 flex max-w-7xl flex-wrap justify-center gap-4 px-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`rounded-full px-6 py-3 font-medium transition duration-300
          ${
            selectedCategory === category
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-white text-gray-700 shadow hover:bg-emerald-100"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
