import type { Metadata, Viewport } from "next"
import { DM_Serif_Display, Noto_Sans_KR } from "next/font/google"
import "./globals.css"

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
})

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
})

export const metadata: Metadata = {
  title: "안동 인트로 | 낙동강 위의 시간여행",
  description:
    "세계유산 하회마을과 서원, 여름이면 새파란 하늘과 낙동강 바람이 어우러진 풍경, 깊은 맛의 찜닭과 소주, 가을 탈춤의 열기까지.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F1EA",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${dmSerif.variable} ${notoSansKR.variable}`}>
      <body>{children}</body>
    </html>
  )
}
