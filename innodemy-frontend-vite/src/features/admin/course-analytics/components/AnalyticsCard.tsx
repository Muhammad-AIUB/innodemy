interface AnalyticsCardProps {
    label: string;
    value: number;
}

const AnalyticsCard = ({ label, value }: AnalyticsCardProps) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

export default AnalyticsCard;
