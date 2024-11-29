export default function ForbiddenPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">403</h1>
                <p className="text-gray-600 mt-4">Nie masz uprawnień do tej strony.</p>
            </div>
        </div>
    );
}
