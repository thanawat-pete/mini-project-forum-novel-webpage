import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { NovelDetail } from './pages/NovelDetail';
import { ReadChapter } from './pages/ReadChapter';
import { Forum } from './pages/Forum';
import { CreateEditPost } from './pages/CreateEditPost';
import { AddEditChapter } from './pages/AddEditChapter';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AuthorProfile } from './pages/AuthorProfile';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/novels/:id" element={<NovelDetail />} />
                <Route path="/read/:id" element={<ReadChapter />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/author/:id" element={<AuthorProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/create-post"
                  element={
                    <ProtectedRoute>
                      <CreateEditPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-post/:id"
                  element={
                    <ProtectedRoute>
                      <CreateEditPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/novels/:novelId/add-chapter"
                  element={
                    <ProtectedRoute>
                      <AddEditChapter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-chapter/:chapterId"
                  element={
                    <ProtectedRoute>
                      <AddEditChapter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route
                  path="*"
                  element={
                    <div className="text-center py-20 space-y-3">
                      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">404</h2>
                      <p className="text-sm text-slate-500">ไม่พบหน้าที่คุณค้นหา</p>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
