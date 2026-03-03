import { useState } from "react";
import type {
    CoursePublicSection,
    CoursePublicSectionType,
    UpdateSectionPayload,
} from "../types";
import { SECTION_TYPE_LABELS } from "../types";

interface SectionEditorProps {
    section: CoursePublicSection;
    onSave: (sectionId: string, payload: UpdateSectionPayload) => void;
    onDelete: (sectionId: string) => void;
    isSaving: boolean;
}

const SectionEditor = ({
    section,
    onSave,
    onDelete,
    isSaving,
}: SectionEditorProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState(section.title ?? "");
    const [subtitle, setSubtitle] = useState(section.subtitle ?? "");
    const [order, setOrder] = useState(section.order);
    const [isVisible, setIsVisible] = useState(section.isVisible);
    const [contentJson, setContentJson] = useState(
        JSON.stringify(section.content, null, 2),
    );
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleSave = () => {
        try {
            const parsedContent = JSON.parse(contentJson);
            if (!Array.isArray(parsedContent)) {
                setJsonError("Content must be a JSON array");
                return;
            }
            setJsonError(null);
            onSave(section.id, {
                title: title || undefined,
                subtitle: subtitle || undefined,
                order,
                content: parsedContent,
                isVisible,
            });
        } catch {
            setJsonError("Invalid JSON format");
        }
    };

    const sectionLabel =
        SECTION_TYPE_LABELS[section.type as CoursePublicSectionType] ??
        section.type;

    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                        #{section.order}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {sectionLabel}
                    </h3>
                    {section.title && (
                        <span className="text-sm text-gray-500">
                            — {section.title}
                        </span>
                    )}
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            section.isVisible
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                        }`}
                    >
                        {section.isVisible ? "Visible" : "Hidden"}
                    </span>
                </div>
                <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {/* Expanded Editor */}
            {isExpanded && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                    {/* Title & Subtitle */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Section title"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Subtitle
                            </label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Section subtitle"
                            />
                        </div>
                    </div>

                    {/* Order & Visibility */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={order}
                                onChange={(e) =>
                                    setOrder(parseInt(e.target.value, 10) || 0)
                                }
                                min={0}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={(e) =>
                                        setIsVisible(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Visible on public page
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* JSON Content Editor */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Content (JSON Array)
                        </label>
                        <textarea
                            value={contentJson}
                            onChange={(e) => {
                                setContentJson(e.target.value);
                                setJsonError(null);
                            }}
                            rows={10}
                            className={`w-full rounded-md border px-3 py-2 font-mono text-sm focus:ring-1 ${
                                jsonError
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                            placeholder='[{"name": "Item 1"}, {"name": "Item 2"}]'
                        />
                        {jsonError && (
                            <p className="mt-1 text-sm text-red-600">
                                {jsonError}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => onDelete(section.id)}
                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                            Delete Section
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionEditor;
