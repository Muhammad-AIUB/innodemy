import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCategoryQuery, useUpdateCategoryMutation } from "../hooks";
import FormErrorMessage from "../../shared/forms/FormErrorMessage";
import FormSection from "../../shared/forms/FormSection";

const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must not exceed 100 characters"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const EditCategoryPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: category, isLoading } = useCategoryQuery(id || "");
    const mutation = useUpdateCategoryMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
        },
    });

    // Prefill form once category loads
    useEffect(() => {
        if (!category) return;
        reset({
            name: category.name,
        });
    }, [category, reset]);

    const onSubmit = (data: CategoryFormValues) => {
        if (!id) return;
        mutation.mutate(
            {
                id,
                payload: data,
            },
            {
                onSuccess: () => navigate("/admin/categories"),
            },
        );
    };

    if (isLoading) {
        return <p className="p-6">Loading category...</p>;
    }

    if (!category) {
        return <p className="p-6 text-red-600">Category not found.</p>;
    }

    return (
        <div className="mx-auto max-w-2xl p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Edit Category
            </h1>

            {mutation.error && (
                <div className="mb-4 rounded border border-red-300 bg-red-50 p-3">
                    <FormErrorMessage error={mutation.error.message} />
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormSection title="Category Information">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register("name")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <FormErrorMessage error={errors.name?.message} />
                        <p className="mt-1 text-xs text-gray-500">
                            Current slug: {category.slug}
                        </p>
                    </div>
                </FormSection>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || mutation.isPending}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {mutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/categories")}
                        className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategoryPage;
