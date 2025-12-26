
import { fetchPendingReports, approveReport, rejectReport } from '@/app/actions/admin-reports';

export default async function AdminDashboard() {
    const reports = await fetchPendingReports();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">管理ダッシュボード</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">未承認のレポート ({reports.length})</h2>

                {reports.length === 0 ? (
                    <p className="text-gray-500">現在、対応が必要なレポートはありません。</p>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report: any) => (
                            <div key={report.id} className="border p-4 rounded bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${report.type === 'closure' ? 'bg-red-100 text-red-800' :
                                                    report.type === 'correction' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {report.type === 'closure' ? '閉店報告' :
                                                    report.type === 'correction' ? '情報修正' : '新規登録'}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {new Date(report.created_at).toLocaleString('ja-JP')}
                                            </span>
                                        </div>

                                        {report.carwash_locations && (
                                            <p className="font-bold text-gray-700 mb-1">
                                                対象: {report.carwash_locations.name}
                                            </p>
                                        )}

                                        <p className="text-gray-800 whitespace-pre-wrap">{report.comment}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <form action={async () => {
                                            'use server'
                                            await approveReport(report.id);
                                        }}>
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                                承認
                                            </button>
                                        </form>
                                        <form action={async () => {
                                            'use server'
                                            await rejectReport(report.id);
                                        }}>
                                            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm">
                                                却下
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
