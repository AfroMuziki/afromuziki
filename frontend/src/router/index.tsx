// frontend/src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { paths } from './paths';
import { ProtectedRoute } from '../layouts/ProtectedRoute';
import { ArtistRoute } from '../layouts/ArtistRoute';
import { AdminRoute } from '../layouts/AdminRoute';
import { GuestRoute } from '../layouts/GuestRoute';
import { AppShell } from '../components/layout/AppShell/AppShell';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { BrowsePage } from '../pages/public/BrowsePage';
import { SearchPage } from '../pages/public/SearchPage';
import { ContentDetailPage } from '../pages/public/ContentDetailPage';
import { ArtistProfilePage } from '../pages/public/ArtistProfilePage';
import { GenrePage } from '../pages/public/GenrePage';
import { PlaylistPage } from '../pages/public/PlaylistPage';
import { AboutPage } from '../pages/public/AboutPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { EmailVerifyPage } from '../pages/auth/EmailVerifyPage';
import { OAuthCallbackPage } from '../pages/auth/OAuthCallbackPage';

// User Pages
import { UserProfilePage } from '../pages/user/UserProfilePage';
import { UserSettingsPage } from '../pages/user/UserSettingsPage';
import { LibraryPage } from '../pages/user/LibraryPage';
import { FollowingPage } from '../pages/user/FollowingPage';
import { DownloadHistoryPage } from '../pages/user/DownloadHistoryPage';

// Artist Pages
import { ArtistDashboardPage } from '../pages/artist/ArtistDashboardPage';
import { ArtistContentPage } from '../pages/artist/ArtistContentPage';
import { ArtistUploadPage } from '../pages/artist/ArtistUploadPage';
import { ArtistEditContentPage } from '../pages/artist/ArtistEditContentPage';
import { ArtistAnalyticsPage } from '../pages/artist/ArtistAnalyticsPage';
import { ArtistFollowersPage } from '../pages/artist/ArtistFollowersPage';
import { ArtistSettingsPage } from '../pages/artist/ArtistSettingsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from '../pages/admin/AdminUserDetailPage';
import { AdminContentPage } from '../pages/admin/AdminContentPage';
import { AdminModerationPage } from '../pages/admin/AdminModerationPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      // Public routes
      { path: paths.home, element: <HomePage /> },
      { path: paths.browse, element: <BrowsePage /> },
      { path: paths.search, element: <SearchPage /> },
      { path: paths.contentDetail(':id'), element: <ContentDetailPage /> },
      { path: paths.artistProfile(':username'), element: <ArtistProfilePage /> },
      { path: paths.genre(':slug'), element: <GenrePage /> },
      { path: paths.playlist(':id'), element: <PlaylistPage /> },
      { path: paths.about, element: <AboutPage /> },

      // Auth routes (guest only)
      {
        element: <GuestRoute />,
        children: [
          { path: paths.login, element: <LoginPage /> },
          { path: paths.register, element: <RegisterPage /> },
          { path: paths.forgotPassword, element: <ForgotPasswordPage /> },
          { path: paths.resetPassword, element: <ResetPasswordPage /> },
          { path: paths.verifyEmail, element: <EmailVerifyPage /> },
          { path: paths.oauthCallback, element: <OAuthCallbackPage /> },
        ],
      },

      // Protected user routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: paths.profile, element: <UserProfilePage /> },
          { path: paths.settings, element: <UserSettingsPage /> },
          { path: paths.library, element: <LibraryPage /> },
          { path: paths.following, element: <FollowingPage /> },
          { path: paths.downloads, element: <DownloadHistoryPage /> },
        ],
      },

      // Artist routes
      {
        element: <ArtistRoute />,
        children: [
          { path: paths.artist.dashboard, element: <ArtistDashboardPage /> },
          { path: paths.artist.content, element: <ArtistContentPage /> },
          { path: paths.artist.upload, element: <ArtistUploadPage /> },
          { path: paths.artist.editContent(':id'), element: <ArtistEditContentPage /> },
          { path: paths.artist.analytics, element: <ArtistAnalyticsPage /> },
          { path: paths.artist.followers, element: <ArtistFollowersPage /> },
          { path: paths.artist.settings, element: <ArtistSettingsPage /> },
        ],
      },

      // Admin routes
      {
        element: <AdminRoute />,
        children: [
          { path: paths.admin.dashboard, element: <AdminDashboardPage /> },
          { path: paths.admin.users, element: <AdminUsersPage /> },
          { path: paths.admin.userDetail(':id'), element: <AdminUserDetailPage /> },
          { path: paths.admin.content, element: <AdminContentPage /> },
          { path: paths.admin.moderation, element: <AdminModerationPage /> },
          { path: paths.admin.reports, element: <AdminReportsPage /> },
          { path: paths.admin.analytics, element: <AdminAnalyticsPage /> },
          { path: paths.admin.settings, element: <AdminSettingsPage /> },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <NotFoundPage /> },
]);