import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@sdkwork/news-pc-shell';
import { HomePage, ItemDetailPage, SearchPage, ProfilePage, LivePage, createNewsService } from '@sdkwork/news-pc-feed';
import { ConsoleLayout } from '@sdkwork/news-pc-console-shell';
import { ConsoleDashboardPage, ConsoleNewsListPage, ConsoleChannelListPage, ConsoleTopicListPage, ConsoleCommentsPage, ConsoleAnalyticsPage, ConsoleSettingsPage, createConsoleNewsService } from '@sdkwork/news-pc-console-feed';
import { AdminLayout } from '@sdkwork/news-pc-admin-shell';
import { AdminDashboardPage, AdminUserListPage, AdminTenantListPage, AdminNewsListPage, AdminModerationPage, AdminAnalyticsPage, AdminSystemPage, AdminAuditPage, createAdminNewsService } from '@sdkwork/news-pc-admin-feed';
import type { NewsService } from '@sdkwork/news-pc-feed';
import { createSdkClients } from './bootstrap/sdkClients';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthGate } from './components/AuthGate';
import { LoginPage } from './components/LoginPage';

const sdkClients = createSdkClients();
const newsService = createNewsService(sdkClients.newsApi);
const consoleNewsService = createConsoleNewsService(sdkClients.newsApi as any);
const adminNewsService = createAdminNewsService(sdkClients.newsApi as any);

function ItemDetailWrapper({ newsService }: { newsService: NewsService }) {
  const { itemSlug } = useParams<{ itemSlug: string }>();
  const navigate = useNavigate();
  if (!itemSlug) return <div>Item not found</div>;
  return <ItemDetailPage newsService={newsService} itemSlug={itemSlug} onBack={() => navigate('/news')} />;
}

function SearchPageWrapper({ newsService }: { newsService: NewsService }) {
  const navigate = useNavigate();
  return <SearchPage newsService={newsService} onBack={() => navigate('/news')} />;
}

function ProfilePageWrapper({ newsService }: { newsService: NewsService }) {
  const navigate = useNavigate();
  return <ProfilePage newsService={newsService} onBack={() => navigate('/news')} />;
}

function LivePageWrapper({ newsService }: { newsService: NewsService }) {
  const navigate = useNavigate();
  return <LivePage newsService={newsService} onBack={() => navigate('/news')} />;
}

function HomePageWrapper({ newsService }: { newsService: NewsService }) {
  const navigate = useNavigate();
  return <HomePage newsService={newsService} onItemSelect={(item) => navigate(`/news/${item.slug}`)} />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Layout><HomePageWrapper newsService={newsService} /></Layout>} />
          
          {/* News routes */}
          <Route path="/news" element={<Layout><HomePageWrapper newsService={newsService} /></Layout>} />
          <Route path="/news/:itemSlug" element={<Layout><ItemDetailWrapper newsService={newsService} /></Layout>} />
          <Route path="/news/search" element={<Layout><SearchPageWrapper newsService={newsService} /></Layout>} />
          <Route path="/news/profile" element={<AuthGate><Layout><ProfilePageWrapper newsService={newsService} /></Layout></AuthGate>} />
          <Route path="/news/live" element={<Layout><LivePageWrapper newsService={newsService} /></Layout>} />

          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Console routes */}
          <Route path="/console" element={<AuthGate><ConsoleLayout><ConsoleDashboardPage consoleNewsService={consoleNewsService} /></ConsoleLayout></AuthGate>} />
          <Route path="/console/news" element={<AuthGate><ConsoleLayout><ConsoleNewsListPage consoleNewsService={consoleNewsService} /></ConsoleLayout></AuthGate>} />
          <Route path="/console/channels" element={<AuthGate><ConsoleLayout><ConsoleChannelListPage consoleNewsService={consoleNewsService} /></ConsoleLayout></AuthGate>} />
          <Route path="/console/topics" element={<AuthGate><ConsoleLayout><ConsoleTopicListPage consoleNewsService={consoleNewsService} /></ConsoleLayout></AuthGate>} />
          <Route path="/console/comments" element={<AuthGate><ConsoleLayout><ConsoleCommentsPage consoleNewsService={consoleNewsService} /></ConsoleLayout></AuthGate>} />
          <Route path="/console/analytics" element={<AuthGate><ConsoleLayout><ConsoleAnalyticsPage consoleNewsService={consoleNewsService} /></ConsoleLayout></AuthGate>} />
          <Route path="/console/settings" element={<AuthGate><ConsoleLayout><ConsoleSettingsPage /></ConsoleLayout></AuthGate>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AuthGate requiredRole="admin"><AdminLayout><AdminDashboardPage adminNewsService={adminNewsService} /></AdminLayout></AuthGate>} />
          <Route path="/admin/users" element={<AuthGate requiredRole="admin"><AdminLayout><AdminUserListPage adminNewsService={adminNewsService} /></AdminLayout></AuthGate>} />
          <Route path="/admin/tenants" element={<AuthGate requiredRole="admin"><AdminLayout><AdminTenantListPage adminNewsService={adminNewsService} /></AdminLayout></AuthGate>} />
          <Route path="/admin/news" element={<AuthGate requiredRole="admin"><AdminLayout><AdminNewsListPage adminNewsService={adminNewsService} /></AdminLayout></AuthGate>} />
          <Route path="/admin/moderation" element={<AuthGate requiredRole="admin"><AdminLayout><AdminModerationPage adminNewsService={adminNewsService} /></AdminLayout></AuthGate>} />
          <Route path="/admin/analytics" element={<AuthGate requiredRole="admin"><AdminLayout><AdminAnalyticsPage adminNewsService={adminNewsService} /></AdminLayout></AuthGate>} />
          <Route path="/admin/system" element={<AuthGate requiredRole="admin"><AdminLayout><AdminSystemPage adminNewsService={adminNewsService} /></AdminLayout></AuthGate>} />
          <Route path="/admin/audit" element={<AuthGate requiredRole="admin"><AdminLayout><AdminAuditPage adminNewsService={adminNewsService} /></AdminLayout></AuthGate>} />
          
          {/* 404 */}
          <Route path="*" element={<Layout><div style={{ padding: '2rem', textAlign: 'center' }}><h1>404</h1><p>Page not found</p><a href="/news">Go to News</a></div></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
