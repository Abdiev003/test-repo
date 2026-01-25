import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Generated Autanate Project',
  description: 'Created with Autanate Builder',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <a href="/" className="mr-6 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block">Autanate Project</span>
              </a>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="/" className="text-sm font-medium hover:text-primary text-primary">
                  Page 862jnce9po4
                </a>
                <a
                  href="/page-862jnce9po4-9-1-26-1955"
                  className="text-sm font-medium hover:text-primary text-muted-foreground"
                >
                  Page 862jnce9po4 (9-1-26 19:55)
                </a>
                <a
                  href="/page-lz81iyn3psr"
                  className="text-sm font-medium hover:text-primary text-muted-foreground"
                >
                  Page lz81iyn3psr
                </a>
                <a
                  href="/page-5svqh9bhclp"
                  className="text-sm font-medium hover:text-primary text-muted-foreground"
                >
                  Page 5svqh9bhclp
                </a>
              </nav>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
