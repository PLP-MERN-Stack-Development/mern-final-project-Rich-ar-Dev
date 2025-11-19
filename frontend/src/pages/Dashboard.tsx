import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import InviteTeamModal from '../components/modals/InviteTeamModal';
import EditProjectModal from '../components/modals/EditProjectModal';
import TaskModal from '../components/modals/TaskModal';
import '../App.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'tasks' | 'analytics'>('overview');
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isInviteTeamModalOpen, setIsInviteTeamModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>(['You', 'john@example.com', 'sarah@example.com', 'mike@example.com']);
  const [taskFilter, setTaskFilter] = useState('all');
  const [taskSort, setTaskSort] = useState('dueDate');

  // Mock data - replace with actual API calls
  const stats = {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalTasks: 47,
    todoTasks: 15,
    inProgressTasks: 12,
    completedTasks: 20,
    teamMembers: 8
  };

  const [recentProjects, setRecentProjects] = useState([
    { 
      id: 1, 
      name: 'Website Redesign', 
      description: 'Complete website redesign with modern UI', 
      progress: 75, 
      status: 'in-progress', 
      dueDate: '2024-02-15', 
      priority: 'high' 
    },
    { 
      id: 2, 
      name: 'Mobile App Launch', 
      description: 'Launch new mobile application', 
      progress: 90, 
      status: 'review', 
      dueDate: '2024-01-30', 
      priority: 'high' 
    },
    { 
      id: 3, 
      name: 'Q1 Marketing Campaign', 
      description: 'Quarterly marketing campaign planning', 
      progress: 100, 
      status: 'completed', 
      dueDate: '2024-01-20', 
      priority: 'medium' 
    },
    { 
      id: 4, 
      name: 'API Integration', 
      description: 'Integrate third-party APIs', 
      progress: 45, 
      status: 'in-progress', 
      dueDate: '2024-03-01', 
      priority: 'medium' 
    }
  ]);

  // CORRECT quickActions array - this is the one that should be used
  const quickActions = [
    { 
      icon: '📋', 
      title: 'Create Project', 
      description: 'Start a new project', 
      action: () => setIsCreateProjectModalOpen(true) 
    },
    { 
      icon: '👥', 
      title: 'Invite Team', 
      description: 'Add team members', 
      action: () => setIsInviteTeamModalOpen(true) 
    },
    { 
      icon: '📊', 
      title: 'View Reports', 
      description: 'See analytics', 
      action: () => setActiveTab('analytics') 
    },
    { 
      icon: '⚡', 
      title: 'Quick Task', 
      description: 'Add a quick task', 
      action: () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
      }
    }
  ];

  // Chart data
  const projectStatusData = {
    labels: ['Completed', 'In Progress', 'Planning', 'On Hold'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ['#4a7c59', '#8fbc8f', '#d4af37', '#2d5a3d'],
        borderWidth: 0,
      },
    ],
  };

  const tasksTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: '#8fbc8f',
        backgroundColor: 'rgba(143, 188, 143, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const teamPerformanceData = {
    labels: ['Design', 'Dev', 'Marketing', 'QA', 'Docs'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 8, 15, 7],
        backgroundColor: '#4a7c59',
        borderRadius: 8,
      },
    ],
  };

  const taskPriorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [25, 50, 25],
        backgroundColor: ['#e74c3c', '#f39c12', '#2ecc71'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
    },
  };

  // Project Management Handlers
  const handleCreateProject = (projectData: any) => {
    const newProject = {
      ...projectData,
      id: Date.now(),
      progress: 0,
      status: 'planning',
      createdAt: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
    alert('Project created successfully!');
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsEditProjectModalOpen(true);
  };

  const handleUpdateProject = (updatedData: any) => {
    setRecentProjects(prev => 
      prev.map(project => 
        project.id === updatedData.id ? { ...project, ...updatedData } : project
      )
    );
    alert('Project updated successfully!');
  };

  const handleDeleteProject = (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setRecentProjects(prev => prev.filter(project => project.id !== projectId));
      alert('Project deleted successfully!');
    }
  };

  const handleQuickProgressUpdate = (projectId: number, change: number) => {
    setRecentProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              progress: Math.max(0, Math.min(100, project.progress + change)),
              status: project.progress + change >= 100 ? 'completed' : project.status
            }
          : project
      )
    );
  };

  // Task Management Handlers
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: any) => {
    if (taskData.id && tasks.find(t => t.id === taskData.id)) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === taskData.id ? { ...task, ...taskData } : task
      ));
      alert('Task updated successfully!');
    } else {
      // Create new task
      const newTask = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        createdBy: user?.username || 'You'
      };
      setTasks(prev => [...prev, newTask]);
      alert('Task created successfully!');
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      alert('Task deleted successfully!');
    }
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleAssignTask = (taskId: number, newAssignee: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, assignee: newAssignee } : task
    ));
  };

  // Helper Functions
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => taskFilter === 'all' || task.status === taskFilter)
    .sort((a, b) => {
      switch (taskSort) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        case 'status':
          const statusOrder = { todo: 0, 'in-progress': 1, review: 2, completed: 3 };
          return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="dashboard">
      {/* Animated Background */}
      <div className="forest-background"></div>
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-welcome">
            <h1>Welcome back, {user?.username || 'User'}! 👋</h1>
            <p>Here's what's happening with your projects today</p>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📋 Projects
        </button>
        <button 
          className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          ✅ Tasks
        </button>
        <button 
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>Total Projects</h3>
                  <div className="stat-number">{stats.totalProjects}</div>
                  <div className="stat-sub">
                    <span className="status-badge active">{stats.activeProjects} active</span>
                    <span className="status-badge completed">{stats.completedProjects} completed</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Total Tasks</h3>
                  <div className="stat-number">{stats.totalTasks}</div>
                  <div className="stat-sub">
                    <span className="status-badge todo">{stats.todoTasks} to do</span>
                    <span className="status-badge in-progress">{stats.inProgressTasks} in progress</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔄</div>
                <div className="stat-info">
                  <h3>In Progress</h3>
                  <div className="stat-number">{stats.inProgressTasks}</div>
                  <div className="stat-sub">
                    <span>{Math.round((stats.inProgressTasks / stats.totalTasks) * 100)}% of total</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>Completed</h3>
                  <div className="stat-number">{stats.completedTasks}</div>
                  <div className="stat-sub">
                    <span>{Math.round((stats.completedTasks / stats.totalTasks) * 100)}% of total</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <div key={index} className="action-card" onClick={action.action}>
                  <div className="action-icon">{action.icon}</div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              ))}
            </div>

            {/* Recent Projects with Edit Features */}
            <div className="section-header">
              <h2>Recent Projects</h2>
              <button className="primary-btn">View All</button>
            </div>
            <div className="projects-grid">
              {recentProjects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <div className="project-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditProject(project)}
                        title="Edit Project"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProject(project.id)}
                        title="Delete Project"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                  
                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Progress</span>
                      <span className="progress-percent">{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="project-meta">
                    <div className="meta-item">
                      <span className="meta-label">Status:</span>
                      <span className={`status-badge ${project.status}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Priority:</span>
                      <span className={`priority-badge ${project.priority}`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Due:</span>
                      <span className="due-date">{new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="quick-update-buttons">
                    <button 
                      className="quick-update-btn"
                      onClick={() => handleQuickProgressUpdate(project.id, -25)}
                      disabled={project.progress <= 0}
                    >
                      -25%
                    </button>
                    <button 
                      className="quick-update-btn"
                      onClick={() => handleQuickProgressUpdate(project.id, 25)}
                      disabled={project.progress >= 100}
                    >
                      +25%
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-tab">
            <div className="tab-header">
              <h2>All Projects</h2>
              <button 
                className="primary-btn" 
                onClick={() => setIsCreateProjectModalOpen(true)}
              >
                + New Project
              </button>
            </div>
            
            {projects.length > 0 ? (
              <div className="projects-grid">
                {projects.map(project => (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <h3>{project.title}</h3>
                      <span className={`status-badge ${project.status}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="project-meta">
                      <span className="progress-text">{project.progress}% complete</span>
                      {project.deadline && (
                        <span className="due-date">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="project-priority">
                      Priority: <span className={`priority-badge ${project.priority}`}>{project.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Projects Yet</h3>
                <p>Create your first project to get started with TaskFlow Pro</p>
                <button 
                  className="primary-btn" 
                  style={{ marginTop: '1rem' }}
                  onClick={() => setIsCreateProjectModalOpen(true)}
                >
                  Create Project
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <div className="tab-header">
              <h2>My Tasks</h2>
              <button 
                className="primary-btn" 
                onClick={handleCreateTask}
              >
                + New Task
              </button>
            </div>
            
            {tasks.length > 0 ? (
              <div className="tasks-container">
                {/* Task Filters */}
                <div className="task-filters">
                  <div className="filter-group">
                    <label>Filter by Status:</label>
                    <select 
                      onChange={(e) => setTaskFilter(e.target.value)}
                      defaultValue="all"
                    >
                      <option value="all">All Tasks</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Sort by:</label>
                    <select 
                      onChange={(e) => setTaskSort(e.target.value)}
                      defaultValue="dueDate"
                    >
                      <option value="dueDate">Due Date</option>
                      <option value="priority">Priority</option>
                      <option value="status">Status</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="tasks-list">
                  {filteredAndSortedTasks.map(task => (
                    <div key={task.id} className={`task-item ${task.status}`}>
                      <div className="task-header">
                        <div className="task-main">
                          <h3 className="task-title">{task.title}</h3>
                          {task.projectName && (
                            <span className="task-project">{task.projectName}</span>
                          )}
                        </div>
                        <div className="task-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditTask(task)}
                            title="Edit Task"
                          >
                            ✏️
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Delete Task"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}

                      <div className="task-details">
                        <div className="task-meta">
                          <div className="meta-item">
                            <span className="meta-label">Status:</span>
                            <select 
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className={`status-select ${task.status}`}
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>

                          <div className="meta-item">
                            <span className="meta-label">Priority:</span>
                            <span className={`priority-badge ${task.priority}`}>
                              {task.priority}
                            </span>
                          </div>

                          <div className="meta-item">
                            <span className="meta-label">Assignee:</span>
                            <select 
                              value={task.assignee || ''}
                              onChange={(e) => handleAssignTask(task.id, e.target.value)}
                              className="assignee-select"
                            >
                              <option value="">Unassigned</option>
                              {teamMembers.map(member => (
                                <option key={member} value={member}>
                                  {member}
                                </option>
                              ))}
                            </select>
                          </div>

                          {task.dueDate && (
                            <div className="meta-item">
                              <span className="meta-label">Due:</span>
                              <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                                {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue(task.dueDate) && ' ⚠️'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="task-created">
                          <span className="created-by">Created by: {task.createdBy}</span>
                          <span className="created-date">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <h3>No Tasks Yet</h3>
                <p>Create your first task to get started with TaskFlow Pro</p>
                <button 
                  className="primary-btn" 
                  style={{ marginTop: '1rem' }}
                  onClick={handleCreateTask}
                >
                  Create Task
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="tab-header">
              <h2>Analytics & Reports</h2>
            </div>
            
            {/* Enhanced Analytics Stats */}
            <div className="analytics-stats">
              <div className="analytics-stat-card">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">🚀</div>
                </div>
                <div className="stat-content">
                  <h4>Productivity Score</h4>
                  <div className="stat-value">87%</div>
                  <div className="stat-trend up">
                    <span className="trend-arrow">↗</span>
                    +12% this week
                  </div>
                </div>
                <div className="stat-decoration"></div>
              </div>

              <div className="analytics-stat-card">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">👥</div>
                </div>
                <div className="stat-content">
                  <h4>Team Activity</h4>
                  <div className="stat-value">42</div>
                  <div className="stat-trend up">
                    <span className="trend-arrow">↗</span>
                    +8 tasks
                  </div>
                </div>
                <div className="stat-decoration"></div>
              </div>

              <div className="analytics-stat-card">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">✅</div>
                </div>
                <div className="stat-content">
                  <h4>Completion Rate</h4>
                  <div className="stat-value">94%</div>
                  <div className="stat-trend up">
                    <span className="trend-arrow">↗</span>
                    +5% this month
                  </div>
                </div>
                <div className="stat-decoration"></div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Project Status Distribution</h3>
                <div className="chart-container">
                  <Doughnut data={projectStatusData} options={chartOptions} />
                </div>
              </div>

              <div className="chart-card">
                <h3>Tasks Completion Trend</h3>
                <div className="chart-container">
                  <Line data={tasksTrendData} options={lineChartOptions} />
                </div>
              </div>

              <div className="chart-card">
                <h3>Team Performance</h3>
                <div className="chart-container">
                  <Bar data={teamPerformanceData} options={lineChartOptions} />
                </div>
              </div>

              <div className="chart-card">
                <h3>Task Priority Distribution</h3>
                <div className="chart-container">
                  <Doughnut data={taskPriorityData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <InviteTeamModal
        isOpen={isInviteTeamModalOpen}
        onClose={() => setIsInviteTeamModalOpen(false)}
      />

      <EditProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => {
          setIsEditProjectModalOpen(false);
          setEditingProject(null);
        }}
        onUpdate={handleUpdateProject}
        project={editingProject}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        projects={[...recentProjects, ...projects]}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default Dashboard;