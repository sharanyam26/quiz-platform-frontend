import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import QuizManagement from './pages/QuizManagement';
import QuestionManagement from './pages/QuestionManagement';
import QuizBrowse from './pages/QuizBrowse';
import QuizDetails from './pages/QuizDetails';
import TakeQuiz from './pages/TakeQuiz';
import QuizResult from './pages/QuizResult';
import Leaderboard from './pages/Leaderboard';
import CategoryManagement from './pages/CategoryManagement';
import UserManagement from './pages/UserManagement';
import AdminAnalytics from './pages/AdminAnalytics';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<QuizManagement />} />
        <Route path="/admin/quizzes/:quizId/questions" element={<QuestionManagement />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/quizzes" element={<QuizBrowse />} />
        <Route path="/student/quizzes/:id" element={<QuizDetails />} />
        <Route path="/student/quizzes/:id/take" element={<TakeQuiz />} />
        <Route path="/student/result/:attemptId" element={<QuizResult />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Routes>
      
      
    </BrowserRouter>
  );
}

export default App;