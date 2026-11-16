import './globals.css';
import Navbar from './components/navbar';
import Footer from './components/footer';

export const metadata = { title: 'ShopSmart | Earth\'s Biggest Selection' };

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <Navbar />
        <main className="main-container">{children}</main>
        <Footer />
        </body>
        </html>
    );
}