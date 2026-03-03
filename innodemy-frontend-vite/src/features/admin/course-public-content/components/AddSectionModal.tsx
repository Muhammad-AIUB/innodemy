import { useState } from "react";
import type { CoursePublicSectionType, CreateSectionPayload } from "../types";
import { SECTION_TYPE_LABELS, SECTION_TYPES } from "../types";

interface AddSectionModalProps {
    existingTypes: CoursePublicSectionType[];
    onAdd: (payload: CreateSectionPayload) => void;
    onClose: () => void;
    isAdding: boolean;
}

const AddSectionModal = ({
    existingTypes,
    onAdd,
    onClose,
    isAdding,
}: AddSectionModalProps) => {
    const availableTypes = SECTION_TYPES.filter(
        (t) => !existingTypes.includes(t) || t === "CUSTOM",
    );

    const [selectedType, setSelectedType] = useState<
        CoursePublicSectionType | ""
    >(availableTypes[0] ?? "");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");

    const handleSubmit = () => {
        if (!selectedType) return;
        onAdd({
            type: selectedType,
            title: title || undefined,
            subtitle: subtitle || undefined,
            order: existingTypes.length,
            content: [],
            isVisible: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Add Section
                </h3>

                {availableTypes.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        All section types have been added.
                    </p>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Section Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) =>
                                    setSelectedType(
                                        e.target
                                            .value as CoursePublicSectionType,
                                    )
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                {availableTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {SECTION_TYPE_LABELS[type]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Title (optional)
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Custom title"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Subtitle (optional)
                            </label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Custom subtitle"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    {availableTypes.length > 0 && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!selectedType || isAdding}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isAdding ? "Adding..." : "Add Section"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddSectionModal;
