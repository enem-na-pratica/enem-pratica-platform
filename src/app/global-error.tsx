/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

// import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// This component intentionally does NOT use layout.tsx providers or globals.css
// because it renders when the root layout itself fails.
// Styles are inlined to guarantee they always work.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // useEffect(() => {
  //   console.error(error);
  // }, [error]);

  return (
    <html lang="pt-br">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050A32',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          padding: '1rem',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Icon */}
        <div
          style={{
            backgroundColor: 'rgba(255, 195, 0, 0.15)',
            padding: '1rem',
            borderRadius: '9999px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#FFC300"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: '#0B1347',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            maxWidth: '24rem',
            width: '100%',
            borderTop: '4px solid #FFC300',
          }}
        >
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            Erro crítico
          </h1>
          <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
            A aplicação encontrou um problema grave e não conseguiu se
            recuperar. Tente recarregar a página.
          </p>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <button
              onClick={reset}
              style={{
                backgroundColor: '#FFC300',
                color: '#050A32',
                fontWeight: 600,
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.opacity = '0.7')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.opacity = '1')
              }
            >
              Tentar novamente
            </button>

            <a
              href="/"
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                opacity: 0.7,
                textDecoration: 'none',
                color: 'inherit',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLAnchorElement).style.textDecoration =
                  'underline')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLAnchorElement).style.textDecoration = 'none')
              }
            >
              Voltar para a página inicial
            </a>
          </div>
        </div>

        {error.digest && (
          <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>
            Código do erro: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
