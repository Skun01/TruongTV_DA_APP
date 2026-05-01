import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { AppInit } from './components/auth/AppInit'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { GooeyToaster } from './components/ui/goey-toaster'
import { TooltipProvider } from './components/ui/tooltip'
import { DashboardPage } from './pages/DashboardPage'
import { DeckDetailPage } from './pages/DeckDetailPage'
import { DeckEditPage } from './pages/DeckEditPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { GrammarDetailPage } from './pages/GrammarDetailPage'
import { KanjiDetailPage } from './pages/KanjiDetailPage'
import { LandingPage } from './pages/LandingPage'
import { LibraryPage } from './pages/LibraryPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { QuickLearnPage } from './pages/QuickLearnPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SearchPage } from './pages/SearchPage'
import { ShadowingListPage } from './pages/ShadowingListPage'
import { ShadowingPracticePage } from './pages/ShadowingPracticePage'
import { ShadowingTopicPage } from './pages/ShadowingTopicPage'
import { StudyResultPage } from './pages/StudyResultPage'
import { StudySessionPage } from './pages/StudySessionPage'
import { VocabularyDetailPage } from './pages/VocabularyDetailPage'
import { JlptExamListPage } from './pages/JlptExamListPage'
import { JlptExamDetailPage } from './pages/JlptExamDetailPage'
import { JlptExamSessionPage } from './pages/JlptExamSessionPage'
import { JlptExamResultPage } from './pages/JlptExamResultPage'
import { JlptExamHistoryPage } from './pages/JlptExamHistoryPage'

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
        <TooltipProvider>
          <GooeyToaster position="top-right" />
          <BrowserRouter>
            <AppInit>
              <Routes>
                <Route element={<GuestRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

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
                  <Route path="/jlpt" element={<JlptExamListPage />} />
                  <Route path="/jlpt/exams/:examId" element={<JlptExamDetailPage />} />
                  <Route path="/jlpt/session/:sessionId" element={<JlptExamSessionPage />} />
                  <Route path="/jlpt/session/:sessionId/result" element={<JlptExamResultPage />} />
                  <Route path="/jlpt/history" element={<JlptExamHistoryPage />} />
                  <Route path="/shadowing" element={<ShadowingListPage />} />
                  <Route path="/shadowing/topics/:topicId" element={<ShadowingTopicPage />} />
                  <Route path="/shadowing/topics/:topicId/practice" element={<ShadowingPracticePage />} />
                </Route>
              </Routes>
            </AppInit>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
