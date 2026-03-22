/* eslint-disable max-lines-per-function */
// import { cookies, headers } from 'next/headers';
// export default async function UserSimulations({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }) {
//   const cookieStore = await cookies();
//   const headerList = await headers();
//   // Dados extraídos (com fallbacks para evitar quebras)
//   const token = cookieStore.get('auth_token')?.value || 'N/A';
//   const userId = headerList.get('x-user-id') || 'N/A';
//   const userRole = headerList.get('x-user-role') || 'N/A';
//   const usernameH = headerList.get('x-user-username') || 'N/A';
//   const { username } = await params;
//   return (
//     <div className="mx-auto max-w-4xl space-y-6 p-8 font-sans">
//       <header className="border-b pb-4">
//         <h1 className="text-2xl font-bold text-slate-800">
//           Course Simulations
//         </h1>
//         <p className="text-slate-500">
//           Visualização de contexto do usuário e rota
//         </p>
//       </header>
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {/* Card de Dados do Usuário (Headers) */}
//         <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//           <h2 className="mb-4 text-sm font-semibold tracking-wider text-blue-600 uppercase">
//             Contexto do Middleware
//           </h2>
//           <div className="space-y-3">
//             <InfoRow
//               label="User ID"
//               value={userId}
//             />
//             <InfoRow
//               label="Role"
//               value={userRole}
//               badge
//             />
//             <InfoRow
//               label="Username (Header)"
//               value={usernameH}
//             />
//           </div>
//         </div>
//         {/* Card de Parâmetros da Rota */}
//         <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//           <h2 className="mb-4 text-sm font-semibold tracking-wider text-purple-600 uppercase">
//             Dados da Rota
//           </h2>
//           <div className="space-y-3">
//             <InfoRow
//               label="URL Param [username]"
//               value={username}
//             />
//           </div>
//         </div>
//       </div>
//       {/* Seção de Token (Sensível) */}
//       <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
//         <h2 className="mb-2 font-mono text-xs font-bold text-slate-400 uppercase">
//           Auth Token
//         </h2>
//         <div className="max-h-24 overflow-y-auto rounded border bg-white p-3 font-mono text-xs break-all text-slate-600">
//           {token}
//         </div>
//       </div>
//     </div>
//   );
// }
// // Sub-componente para organizar as linhas de informação
// function InfoRow({
//   label,
//   value,
//   badge = false,
// }: {
//   label: string;
//   value: string;
//   badge?: boolean;
// }) {
//   return (
//     <div className="flex flex-col border-b border-slate-50 pb-2 last:border-0">
//       <span className="text-xs font-medium text-slate-400">{label}</span>
//       <span
//         className={`text-sm font-semibold ${badge ? 'mt-1 w-fit rounded bg-blue-50 px-2 py-0.5 text-blue-700' : 'text-slate-700'}`}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }
import { cookies, headers } from 'next/headers';
import Link from 'next/link';

import { makeMockExamService } from '@/src/web/api';
import { Header } from '@/src/web/components';

import {
  MockExamForm,
  MockExamListSection,
  MockStatsSection,
} from '../_components';

export default async function MockExamsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const headerList = await headers();

  const { username } = await params;
  const { showForm } = await searchParams;
  const isFormOpen = showForm === 'true';

  const { mockExams, statistics } =
    await makeMockExamService().listUserMockExamsStatistics(username);

  return (
    <div className="min-h-screen bg-(--background) pb-20 text-(--foreground) transition-colors duration-500">
      <Header>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            aria-label="Voltar para Dashboard"
          >
            <BackArrow />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">
            Simulados de <span className="text-(--accent)">{username}</span>
          </h1>
        </div>
      </Header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        {/* --- Statistics section --- */}
        {mockExams.length > 0 && <MockStatsSection stats={statistics} />}

        <hr className="border-(--foreground)/10" />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Histórico</h2>
          <Link
            href={isFormOpen ? '?' : '?showForm=true'}
            className="button-primary flex items-center gap-2 shadow-(--accent)/20 shadow-lg"
          >
            <span>{isFormOpen ? 'Cancelar' : 'Novo Simulado'}</span>
            {!isFormOpen && <span>+</span>}
          </Link>
        </div>

        {/* --- Form for registering new Mock Exams --- */}
        {isFormOpen && <MockExamForm />}

        {/* --- List Section --- */}
        <MockExamListSection mockExams={mockExams} />
      </main>
    </div>
  );
}

// Back arrow icon (Reused)
function BackArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="h-6 w-6 transition-colors hover:text-(--accent)"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
  );
}
