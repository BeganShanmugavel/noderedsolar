import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unexpected frontend error' };
  }

  componentDidCatch(error, info) {
    console.error('Frontend crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', padding: 24 }}>
          <h1 style={{ color: '#22d3ee' }}>Something went wrong</h1>
          <p>The UI crashed, but this error screen prevents a blank white page.</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#0f172a', padding: 12, borderRadius: 8 }}>
            {this.state.message}
          </pre>
          <button onClick={() => window.location.assign('/login')} style={{ marginTop: 12, padding: '8px 12px' }}>
            Go to Login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
