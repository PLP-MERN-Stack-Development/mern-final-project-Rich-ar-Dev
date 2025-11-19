import React, { useState, useEffect } from 'react';

interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: string;
  dueDate: string;
  priority: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (projectData: any) => void;
  project: Project | null;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  project 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    progress: 0,
    status: 'planning',
    dueDate: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        progress: project.progress || 0,
        status: project.status || 'planning',
        dueDate: project.dueDate || '',
        priority: project.priority || 'medium'
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      id: project?.id
    });
    onClose();
  };

  const handleProgressChange = (newProgress: number) => {
    setFormData(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(100, newProgress))
    }));
  };

  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Project</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-name">Project Name *</label>
            <input
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter project name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your project..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Progress: {formData.progress}%</label>
            <div className="progress-slider-container">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                className="progress-slider"
              />
              <div className="progress-buttons">
                <button 
                  type="button" 
                  className="progress-btn"
                  onClick={() => handleProgressChange(formData.progress - 10)}
                >
                  -10%
                </button>
                <button 
                  type="button" 
                  className="progress-btn"
                  onClick={() => handleProgressChange(formData.progress + 10)}
                >
                  +10%
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-status">Status</label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-priority">Priority</label>
              <select
                id="edit-priority"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-dueDate">Due Date</label>
            <input
              type="date"
              id="edit-dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;