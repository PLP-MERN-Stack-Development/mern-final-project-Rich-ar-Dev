import React, { useState } from 'react';

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteTeamModal: React.FC<InviteTeamModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [inviteLink, setInviteLink] = useState('');

  const generateInviteLink = () => {
    // In a real app, this would call your backend API
    const token = Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/invite/${token}`;
    setInviteLink(link);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const sendEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call your backend API
    console.log('Sending invite to:', email, 'with role:', role);
    alert(`Invite sent to ${email}`);
    setEmail('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Invite Team Members</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="invite-methods">
          {/* Method 1: Email Invite */}
          <div className="invite-method">
            <h3>📧 Invite via Email</h3>
            <form onSubmit={sendEmailInvite} className="email-invite-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="team.member@company.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="member">Team Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <button type="submit" className="primary-btn">
                Send Invite
              </button>
            </form>
          </div>

          {/* Method 2: Invite Link */}
          <div className="invite-method">
            <h3>🔗 Invite via Link</h3>
            <div className="invite-link-section">
              {!inviteLink ? (
                <button 
                  onClick={generateInviteLink}
                  className="primary-btn"
                >
                  Generate Invite Link
                </button>
              ) : (
                <div className="invite-link-generated">
                  <div className="link-display">
                    <input 
                      type="text" 
                      value={inviteLink} 
                      readOnly 
                      className="invite-link-input"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="copy-btn"
                    >
                      📋
                    </button>
                  </div>
                  <p className="link-info">
                    Share this link with team members to join your workspace
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamModal;