import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { GooeyToaster } from './components/ui/goey-toaster'
import { AppInit } from './components/auth/AppInit'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SearchPage } from './pages/SearchPage'
import { VocabularyDetailPage } from './pages/VocabularyDetailPage'
import { GrammarDetailPage } from './pages/GrammarDetailPage'
import { KanjiDetailPage } from './pages/KanjiDetailPage'
import { LibraryPage } from './pages/LibraryPage'
import { DeckDetailPage } from './pages/DeckDetailPage'
import { DeckEditPage } from './pages/DeckEditPage'
import { QuickLearnPage } from './pages/QuickLearnPage'
import { StudySessionPage } from './pages/StudySessionPage'
import { StudyResultPage } from './pages/StudyResultPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    mutations: { retry: 0 },
  },
})

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GooeyToaster position="top-right" />
        <BrowserRouter>
          <AppInit>
            <Routes>

              {/* Guest-only — redirect to /dashboard if already logged in */}
              <Route element={<GuestRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Protected — redirect to /login if not logged in */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/library/decks/:deckId" element={<DeckDetailPage />} />
                <Route path="/library/my-decks/:deckId/edit" element={<DeckEditPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/vocabulary/:id" element={<VocabularyDetailPage />} />
                <Route path="/grammar/:id" element={<GrammarDetailPage />} />
                <Route path="/kanji/:id" element={<KanjiDetailPage />} />
                <Route path="/quick-learn" element={<QuickLearnPage />} />
                <Route path="/study/:sessionId" element={<StudySessionPage />} />
                <Route path="/study/:sessionId/result" element={<StudyResultPage />} />
              </Route>
            </Routes>
          </AppInit>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
