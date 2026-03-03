import type { CoursePublicSection } from "../types";

/** Safely convert unknown to string */
const str = (val: unknown): string => (val == null ? "" : String(val));

interface SectionRendererProps {
    section: CoursePublicSection;
}

/** Renders a single public section based on its type */
const SectionRenderer = ({ section }: SectionRendererProps) => {
    const items = section.content as Record<string, unknown>[];
    if (!items || items.length === 0) return null;

    const heading = section.title ?? undefined;
    const sub = section.subtitle ?? undefined;

    switch (section.type) {
        case "MODULES":
            return (
                <ModulesSection title={heading} subtitle={sub} items={items} />
            );
        case "INSTRUCTORS":
            return (
                <InstructorsSection
                    title={heading}
                    subtitle={sub}
                    items={items}
                />
            );
        case "FEATURES":
            return (
                <FeaturesSection title={heading} subtitle={sub} items={items} />
            );
        case "PROJECTS":
            return (
                <ProjectsSection title={heading} subtitle={sub} items={items} />
            );
        case "TARGET_AUDIENCE":
            return (
                <TargetAudienceSection
                    title={heading}
                    subtitle={sub}
                    items={items}
                />
            );
        case "PREREQUISITES":
            return (
                <PrerequisitesSection
                    title={heading}
                    subtitle={sub}
                    items={items}
                />
            );
        case "FAQ":
            return <FaqSection title={heading} subtitle={sub} items={items} />;
        case "HERO":
        case "CUSTOM":
        default:
            return (
                <GenericSection title={heading} subtitle={sub} items={items} />
            );
    }
};

export default SectionRenderer;

// ─── Section Header ─────────────────────────────────────────

const SectionHeader = ({
    title,
    subtitle,
}: {
    title?: string;
    subtitle?: string;
}) => (
    <div className="mb-6 text-center">
        {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
        {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </div>
);

// ─── Modules Section ────────────────────────────────────────

const ModulesSection = ({
    title = "Course Modules",
    subtitle,
    items,
}: {
    title?: string;
    subtitle?: string;
    items: Record<string, unknown>[];
}) => (
    <div className="py-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="space-y-3">
            {items.map((mod, idx) => (
                <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                >
                    <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                            {idx + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                            {str(mod.name) || `Module ${idx + 1}`}
                        </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                        {mod.sessions != null && (
                            <span>{str(mod.sessions)} sessions</span>
                        )}
                        {mod.projects != null && (
                            <span>{str(mod.projects)} projects</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── Instructors Section ────────────────────────────────────

const InstructorsSection = ({
    title = "Instructors & Mentors",
    subtitle,
    items,
}: {
    title?: string;
    subtitle?: string;
    items: Record<string, unknown>[];
}) => (
    <div className="py-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((inst, idx) => (
                <div
                    key={idx}
                    className="rounded-lg border border-gray-200 bg-white p-6 text-center"
                >
                    {!!inst.image && (
                        <img
                            src={str(inst.image)}
                            alt={str(inst.name)}
                            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                        />
                    )}
                    <h3 className="font-semibold text-gray-900">
                        {str(inst.name)}
                    </h3>
                    {!!inst.title && (
                        <p className="mt-1 text-sm text-gray-600">
                            {str(inst.title)}
                        </p>
                    )}
                    {!!inst.organization && (
                        <p className="text-sm text-gray-500">
                            {str(inst.organization)}
                        </p>
                    )}
                </div>
            ))}
        </div>
    </div>
);

// ─── Features Section ───────────────────────────────────────

const FeaturesSection = ({
    title = "What You Will Get",
    subtitle,
    items,
}: {
    title?: string;
    subtitle?: string;
    items: Record<string, unknown>[];
}) => (
    <div className="py-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((feat, idx) => (
                <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
                >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-lg">
                        {str(feat.icon) || "✓"}
                    </span>
                    <div>
                        <h4 className="font-medium text-gray-900">
                            {str(feat.name) || str(feat.title)}
                        </h4>
                        {!!feat.description && (
                            <p className="mt-1 text-sm text-gray-600">
                                {str(feat.description)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── Projects Section ───────────────────────────────────────

const ProjectsSection = ({
    title = "Projects You Will Build",
    subtitle,
    items,
}: {
    title?: string;
    subtitle?: string;
    items: Record<string, unknown>[];
}) => (
    <div className="py-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((proj, idx) => (
                <div
                    key={idx}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                    {!!proj.image && (
                        <img
                            src={str(proj.image)}
                            alt={str(proj.name)}
                            className="h-40 w-full object-cover"
                        />
                    )}
                    <div className="p-4">
                        <h4 className="font-medium text-gray-900">
                            {str(proj.name) || `Project ${idx + 1}`}
                        </h4>
                        {!!proj.description && (
                            <p className="mt-1 text-sm text-gray-600">
                                {str(proj.description)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── Target Audience Section ────────────────────────────────

const TargetAudienceSection = ({
    title = "Who This Course Is For",
    subtitle,
    items,
}: {
    title?: string;
    subtitle?: string;
    items: Record<string, unknown>[];
}) => (
    <div className="py-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
                >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-lg">
                        {str(item.icon) || "👤"}
                    </span>
                    <div>
                        <h4 className="font-medium text-gray-900">
                            {str(item.name) || str(item.title)}
                        </h4>
                        {!!item.description && (
                            <p className="mt-1 text-sm text-gray-600">
                                {str(item.description)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── Prerequisites Section ──────────────────────────────────

const PrerequisitesSection = ({
    title = "What You Will Need",
    subtitle,
    items,
}: {
    title?: string;
    subtitle?: string;
    items: Record<string, unknown>[];
}) => (
    <div className="py-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4"
                >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-sm">
                        {str(item.icon) || "📋"}
                    </span>
                    <span className="text-gray-900">
                        {str(item.name) || str(item.text)}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

// ─── FAQ Section ────────────────────────────────────────────

const FaqSection = ({
    title = "Frequently Asked Questions",
    subtitle,
    items,
}: {
    title?: string;
    subtitle?: string;
    items: Record<string, unknown>[];
}) => (
    <div className="py-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="space-y-3">
            {items.map((faq, idx) => (
                <details
                    key={idx}
                    className="group rounded-lg border border-gray-200 bg-white"
                >
                    <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 group-open:border-b group-open:border-gray-200">
                        {str(faq.question) ||
                            str(faq.title) ||
                            `Question ${idx + 1}`}
                    </summary>
                    <div className="px-4 py-3 text-gray-600">
                        {str(faq.answer) || str(faq.content)}
                    </div>
                </details>
            ))}
        </div>
    </div>
);

// ─── Generic / Custom Section ───────────────────────────────

const GenericSection = ({
    title,
    subtitle,
    items,
}: {
    title?: string;
    subtitle?: string;
    items: Record<string, unknown>[];
}) => (
    <div className="py-8">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="space-y-3">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                >
                    {!!item.title && (
                        <h4 className="font-medium text-gray-900">
                            {str(item.title)}
                        </h4>
                    )}
                    {!!item.description && (
                        <p className="mt-1 text-sm text-gray-600">
                            {str(item.description)}
                        </p>
                    )}
                    {!!item.text && (
                        <p className="text-gray-700">{str(item.text)}</p>
                    )}
                </div>
            ))}
        </div>
    </div>
);
