import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HR NEXA — SaaS HR და თანამშრომელთა კეთილდღეობის პლატფორმა',
  description:
    'საოპერაციო HR პროცესების ავტომატიზაცია, რეკრუტინგი (ATS), სწავლება (LMS), AI ასისტენტი, გემიფიკაცია და Earned Wage Access (EWA)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body className="antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
