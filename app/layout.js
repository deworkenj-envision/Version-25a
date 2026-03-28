
export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{fontFamily:"Arial", padding:20}}>
        <nav style={{marginBottom:20}}>
          <a href="/">Home</a> | 
          <a href="/designer"> Designer</a> | 
          <a href="/dashboard"> Dashboard</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
