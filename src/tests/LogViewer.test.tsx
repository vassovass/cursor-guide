import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogViewer } from '@/components/debug/LogViewer';
import { RoadmapMenu } from '@/components/layout/RoadmapMenu';
import { BrowserRouter } from 'react-router-dom';

describe('LogViewer Integration Tests', () => {
  it('should toggle LogViewer visibility when clicking View Logs', () => {
    render(
      <BrowserRouter>
        <RoadmapMenu />
      </BrowserRouter>
    );

    // Initially, LogViewer should not be visible
    expect(screen.queryByText('Debug Logs')).not.toBeInTheDocument();

    // Click the View Logs toggle
    const viewLogsButton = screen.getByText('View Logs');
    fireEvent.click(viewLogsButton);

    // LogViewer should now be visible with sample logs
    expect(screen.getByText('Debug Logs')).toBeInTheDocument();
    expect(screen.getByText('[INFO] Application initialized')).toBeInTheDocument();
    expect(screen.getByText('[WARN] No routes matched location "/logs"')).toBeInTheDocument();
    expect(screen.getByText('[ERROR] Failed to load resource')).toBeInTheDocument();

    // Click again to hide
    fireEvent.click(viewLogsButton);
    expect(screen.queryByText('Debug Logs')).not.toBeInTheDocument();
  });

  it('should close LogViewer when clicking the close button', () => {
    const onClose = vi.fn();
    render(<LogViewer isOpen={true} onClose={onClose} />);

    // Find and click the close button
    const closeButton = screen.getByLabelText('Close logs');
    fireEvent.click(closeButton);

    // Verify onClose was called
    expect(onClose).toHaveBeenCalled();
  });

  it('should render all log levels with correct styling', () => {
    render(<LogViewer isOpen={true} onClose={() => {}} />);

    // Check if logs are rendered with correct styling
    const infoLog = screen.getByText(/\[INFO\]/);
    const warnLog = screen.getByText(/\[WARN\]/);
    const errorLog = screen.getByText(/\[ERROR\]/);

    expect(infoLog.parentElement).toHaveClass('text-muted-foreground');
    expect(warnLog.parentElement).toHaveClass('text-yellow-500');
    expect(errorLog.parentElement).toHaveClass('text-red-500');
  });
});