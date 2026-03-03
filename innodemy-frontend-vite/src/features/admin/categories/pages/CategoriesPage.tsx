import { Link } from "react-router-dom";
import { useCategoriesQuery, useDeleteCategoryMutation } from "../hooks";

const CategoriesPage = () => {
    const { data: categories = [], isLoading, error } = useCategoriesQuery();
    const deleteMutation = useDeleteCategoryMutation();

    const handleDelete = (id: string, name: string) => {
        if (
            confirm(
                `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            )
        ) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return <div className="p-6">Loading categories...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-600">
                Error loading categories: {error.message}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Categories
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage categories for courses, webinars, and blogs
                    </p>
                </div>
                <Link
                    to="/admin/categories/create"
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Add New Category
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                    <p className="text-gray-500">No categories found.</p>
                    <Link
                        to="/admin/categories/create"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        Create your first category
                    </Link>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-500">
                                            {category.slug}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <Link
                                            to={`/admin/categories/${category.id}/edit`}
                                            className="mr-4 text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    category.id,
                                                    category.name,
                                                )
                                            }
                                            disabled={deleteMutation.isPending}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
