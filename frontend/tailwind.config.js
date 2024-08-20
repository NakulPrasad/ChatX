/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0056b3', // Darker Blue (Primary button, links)
        primaryHover: '#004085', // Even Darker Blue (Primary button hover)
        secondary: '#6c757d', // Gray (Secondary button, accents)
        secondaryHover: '#5a6268', // Darker Gray (Secondary button hover)
        accent: '#dc3545', // Red (Errors, notifications)
        background: '#ffffff', // White (Main background)
        card: '#f8f9fa', // Light Gray (Card backgrounds, subtle sections)
        border: '#dee2e6', // Light Gray (Borders, dividers)
        textPrimary: '#212529', // Dark Gray (Primary text)
        textPrimaryHover: '#1c1e1f', // Slightly darker for hover (Primary text)
        textSecondary: '#495057', // Medium Gray (Secondary text, placeholders)
        textSecondaryHover: '#3e474d', // Slightly darker for hover (Secondary text)
        link: '#0056b3', // Darker Blue (Links)
        linkHover: '#004085', // Even Darker Blue (Link hover)
        buttonPrimary: '#0056b3', // Darker Blue (Primary buttons)
        buttonPrimaryHover: '#004085', // Even Darker Blue (Primary button hover)
        buttonPrimaryHover2: '#003366', // Even Darker Blue (Primary button hover)
        buttonSecondary: '#6c757d', // Gray (Secondary buttons)
        buttonSecondaryHover: '#5a6268', // Darker Gray (Secondary button hover)
        borderHover: '#ced4da' // Slightly darker gray for borders on hover
      }
    }

  },
  plugins: []
}
