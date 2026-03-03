import { useNavigate, useParams } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { useAdminForm } from "../../shared/forms/useAdminForm";
import FormSection from "../../shared/forms/FormSection";
import SingleImageUpload from "../../shared/forms/SingleImageUpload";
import { useAdminBlogDetailQuery, useUpdateBlogMutation } from "../hooks";
import { BlogSchema } from "../schema";
import type { UpdateBlogPayload } from "../api";
import { useApiError } from "../../../../hooks/useApiError";
import { serializeBlogContent } from "../utils/serializeBlogContent";

const EditBlogPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getErrorMessage } = useApiError();

    const {
        data: blog,
        isLoading,
        isError,
        error,
    } = useAdminBlogDetailQuery(id ?? "");
    const mutation = useUpdateBlogMutation();

    const methods = useAdminForm<UpdateBlogPayload>({
        schema: BlogSchema,
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            bannerImage: "",
            authorId: "",
            categoryId: "",
            readDuration: 5,
        },
    });

    useEffect(() => {
        if (blog) {
            methods.reset({
                title: blog.title,
                excerpt: blog.excerpt ?? "",
                content: typeof blog.content === "string" ? blog.content : "",
                bannerImage: blog.bannerImage ?? "",
                authorId: blog.author.id,
                categoryId: blog.category?.id ?? "",
                readDuration: blog.readDuration ?? 5,
            });
        }
    }, [blog, methods]);

    const onSubmit = (data: UpdateBlogPayload) => {
        const contentBlocks = serializeBlogContent(data.content ?? "");
        mutation.mutate(
            { id: id as string, payload: { ...data, contentBlocks } },
            {
                onSuccess: () => navigate("/admin/blogs"),
            },
        );
    };

    if (isLoading) {
        return <div className="p-6 text-gray-500">Loading blog details...</div>;
    }

    if (isError) {
        return <div className="p-6 text-red-600">{getErrorMessage(error)}</div>;
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Edit Blog
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Update the blog content. Status:{" "}
                        <span className="font-semibold">{blog?.status}</span>
                    </p>
                </div>
            </div>

            {mutation.isError && (
                <div className="mb-6 rounded-md bg-red-50 p-4 font-medium text-red-600">
                    Failed to edit blog.
                </div>
            )}

            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                >
                    <FormSection title="Basic Information">
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    {...methods.register("title")}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                />
                                {methods.formState.errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {methods.formState.errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Excerpt
                                </label>
                                <textarea
                                    {...methods.register("excerpt")}
                                    rows={2}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Author ID *
                                    </label>
                                    <input
                                        type="text"
                                        {...methods.register("authorId")}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs focus:border-blue-500 focus:outline-none"
                                    />
                                    {methods.formState.errors.authorId && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                methods.formState.errors
                                                    .authorId.message
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Category ID (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Valid UUID or empty"
                                        {...methods.register("categoryId")}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Content">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Content (Markdown/HTML text) *
                            </label>
                            <textarea
                                {...methods.register("content")}
                                rows={10}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
                            />
                            {methods.formState.errors.content && (
                                <p className="mt-1 text-sm text-red-600">
                                    {methods.formState.errors.content.message}
                                </p>
                            )}
                        </div>
                    </FormSection>

                    <FormSection title="Media">
                        <SingleImageUpload
                            name="bannerImage"
                            label="Banner Image URL"
                            placeholder="https://example.com/image.jpg"
                        />
                    </FormSection>

                    <FormSection title="SEO & Meta">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Read Duration (mins)
                                </label>
                                <input
                                    type="number"
                                    {...methods.register("readDuration", {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </FormSection>

                    <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/blogs")}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {mutation.isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default EditBlogPage;
