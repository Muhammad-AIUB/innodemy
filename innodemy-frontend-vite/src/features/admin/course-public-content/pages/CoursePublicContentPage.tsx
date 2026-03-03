import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useCoursePublicSectionsQuery,
    useCreateSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
} from "../hooks";
import SectionEditor from "../components/SectionEditor";
import AddSectionModal from "../components/AddSectionModal";
import type {
    CreateSectionPayload,
    UpdateSectionPayload,
    CoursePublicSectionType,
} from "../types";

const CoursePublicContentPage = () => {
    const { id: courseId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);

    const {
        data: sections,
        isLoading,
        isError,
        error,
    } = useCoursePublicSectionsQuery(courseId ?? "");

    const createMutation = useCreateSectionMutation(courseId ?? "");
    const updateMutation = useUpdateSectionMutation(courseId ?? "");
    const deleteMutation = useDeleteSectionMutation(courseId ?? "");

    const handleAdd = (payload: CreateSectionPayload) => {
        createMutation.mutate(payload, {
            onSuccess: () => setShowAddModal(false),
        });
    };

    const handleSave = (sectionId: string, payload: UpdateSectionPayload) => {
        updateMutation.mutate({ sectionId, payload });
    };

    const handleDelete = (sectionId: string) => {
        if (
            window.confirm(
                "Are you sure you want to delete this section? This cannot be undone.",
            )
        ) {
            deleteMutation.mutate(sectionId);
        }
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-8">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {(error as Error)?.message ?? "Failed to load sections"}
                </div>
            </div>
        );
    }

    const existingTypes = (sections ?? []).map(
        (s) => s.type as CoursePublicSectionType,
    );

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                        &larr; Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Public Page Content
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage the sections displayed on the public course
                        detail page.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Section
                </button>
            </div>

            {/* Sections List */}
            {!sections || sections.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <p className="text-gray-500">
                        No public content sections yet.
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                        Click "Add Section" to create your first section.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sections.map((section) => (
                        <SectionEditor
                            key={section.id}
                            section={section}
                            onSave={handleSave}
                            onDelete={handleDelete}
                            isSaving={updateMutation.isPending}
                        />
                    ))}
                </div>
            )}

            {/* Add Section Modal */}
            {showAddModal && (
                <AddSectionModal
                    existingTypes={existingTypes}
                    onAdd={handleAdd}
                    onClose={() => setShowAddModal(false)}
                    isAdding={createMutation.isPending}
                />
            )}
        </div>
    );
};

export default CoursePublicContentPage;
