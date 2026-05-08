import type { Metadata } from 'next';
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
});

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-ibm-plex-sans',
});

export const metadata: Metadata = {
    title: 'Climate Change Awareness Portal',
    description:
        'A premium climate intelligence portal with live dashboard insights, generated reports, and action guidance.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <body
                className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} bg-ink-950 text-white antialiased`}>
                <div className="min-h-screen">
                    <SiteHeader />
                    <div className="min-h-[calc(100vh-140px)]">{children}</div>
                    <SiteFooter />
                </div>
            </body>
        </html>
    );
}
