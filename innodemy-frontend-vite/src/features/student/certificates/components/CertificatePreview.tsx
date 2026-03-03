interface CertificatePreviewProps {
    platformName: string;
    studentName: string;
    courseTitle: string;
    onDownload: () => void;
}

const CertificatePreview = ({
    platformName,
    studentName,
    courseTitle,
    onDownload,
}: CertificatePreviewProps) => {
    return (
        <div className="mx-auto max-w-3xl rounded-lg border bg-white p-8">
            <p className="text-center text-sm uppercase tracking-widest text-gray-500">
                {platformName}
            </p>
            <h1 className="mt-4 text-center text-3xl font-bold">
                Certificate of Completion
            </h1>
            <p className="mt-8 text-center text-gray-600">This certifies that</p>
            <p className="mt-2 text-center text-2xl font-semibold">
                {studentName}
            </p>
            <p className="mt-6 text-center text-gray-600">
                has successfully completed this course
            </p>
            <p className="mt-2 text-center text-xl font-semibold">{courseTitle}</p>
            <p className="mx-auto mt-6 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Completed
            </p>

            <div className="mt-8 text-center">
                <button
                    type="button"
                    onClick={onDownload}
                    className="rounded bg-black px-5 py-2 text-sm font-medium text-white"
                >
                    Download Certificate
                </button>
            </div>
        </div>
    );
};

export default CertificatePreview;
