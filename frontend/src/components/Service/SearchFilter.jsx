import { FaSearch } from "react-icons/fa";

function SearchFilter({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-lg md:grid-cols-3">
        {/* Search */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Tìm kiếm dịch vụ
          </label>

          <div className="flex items-center rounded-xl border px-4">
            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Nhập tên dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none p-3 outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Danh mục
          </label>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Sắp xếp
          </label>
        </div>
      </div>
    </section>
  );
}

export default SearchFilter;
