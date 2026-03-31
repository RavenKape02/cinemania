import '../styles/index.css'

export const metadata = {
  title: 'Watch Party',
  description: 'Discover and watch movies and TV shows',
  icons: {
    icon: '/movieicon.gif',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
