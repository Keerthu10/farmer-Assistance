import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ArchitectureDocsModal } from '../architecture/ArchitectureDocsModal';
import { UserFlowVisualizerModal } from '../docs/UserFlowVisualizerModal';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPath, onNavigate }) => {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isFlowsOpen, setIsFlowsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/30 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top Navigation */}
      <Navbar
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenFlows={() => setIsFlowsOpen(true)}
        onToggleSidebarMobile={() => setIsMobileSidebarOpen(prev => !prev)}
        onNavigate={onNavigate}
      />

      {/* Main workspace with Sidebar */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Architecture & Deliverables Docs Modal */}
      <ArchitectureDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* User Flows & Business Architecture Visualizer Modal */}
      <UserFlowVisualizerModal
        isOpen={isFlowsOpen}
        onClose={() => setIsFlowsOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
