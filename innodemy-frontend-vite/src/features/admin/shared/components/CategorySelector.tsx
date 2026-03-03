import { useCategoriesQuery } from "../../categories/hooks";

interface CategorySelectorProps {
    value: string;
    onChange: (categoryId: string) => void;
    error?: string;
    label?: string;
    placeholder?: string;
}

const CategorySelector = ({
    value,
    onChange,
    error,
    label = "Category",
    placeholder = "-- Select Category --",
}: CategorySelectorProps) => {
    const { data: categories = [], isLoading } = useCategoriesQuery();

    return (
        <div>
            <label
                htmlFor="categoryId"
                className="mb-1 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <select
                id="categoryId"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
            >
                <option value="">{placeholder}</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            {isLoading && (
                <p className="mt-1 text-xs text-gray-500">
                    Loading categories...
                </p>
            )}
            {!isLoading && categories.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                    No categories found. Create one first.
                </p>
            )}
        </div>
    );
};

export default CategorySelector;
