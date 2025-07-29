'use client';
import { SettingsNav } from "@/components/SettingsNav";
import { Grid, ScrollArea } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./Settings.module.css";

type SettingContainerProps = {

}

// All available sections in order
const sections = ['general', 'shift', 'role', 'position', 'help'];

const SettingContainer = (props: SettingContainerProps) => {
  const [activeSection, setActiveSection] = useState<string>("general");

  // Reference to the scroll area viewport
  const viewportRef = useRef<HTMLDivElement>(null);

  // Function to handle intersection observer
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  }, []);

  // Set up intersection observer for each section
  useEffect(() => {
    if (!viewportRef.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: viewportRef.current,
      rootMargin: '0px',
      threshold: 0.3, // Trigger when 30% of the section is visible
    });

    // Observe all section elements using data attributes
    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, viewportRef.current]);

  // Handle manual navigation
  const handleNavChange = (section: string) => {
    setActiveSection(section);

    // Find the target section using data attribute
    const targetSection = document.getElementById(section);
    if (targetSection && viewportRef.current) {
      // Set focus to the section for better keyboard navigation
      targetSection.tabIndex = -1;
      targetSection.focus({ preventScroll: true });

      // Use scrollIntoView with the viewport reference - more reliable than direct DOM manipulation
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };  // Update the URL hash when active section changes
  useEffect(() => {
    if (activeSection) {
      // Update URL hash without causing a page reload
      window.history.replaceState(null, '', `#${activeSection}`);
    }
  }, [activeSection]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const currentIndex = sections.indexOf(activeSection);
        if (currentIndex < sections.length - 1) {
          const nextSection = sections[currentIndex + 1];
          handleNavChange(nextSection);
        }
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const currentIndex = sections.indexOf(activeSection);
        if (currentIndex > 0) {
          const prevSection = sections[currentIndex - 1];
          handleNavChange(prevSection);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection]);

  return (
    <Grid gutter={0}>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <SettingsNav
          active={activeSection}
          onNavChange={handleNavChange}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 8 }}>
        <ScrollArea
          h="calc(100vh - 120px)"
          type="hover"
          scrollbarSize={6}
          scrollHideDelay={500}
          viewportRef={viewportRef}>
          <div className={styles.contentWrapper}>
            <div
              id="general"
              data-section-id="general"
              className={`${styles['settings-section']} ${activeSection === 'general' ? styles.active : ''}`}
            >
              <h2>General Settings</h2>
              <p>Configure general application settings here.</p>
              {/* General Settings Content */}
            </div>
            <div
              id="shift"
              data-section-id="shift"
              className={`${styles['settings-section']} ${activeSection === 'shift' ? styles.active : ''}`}
            >
              <h2>Shift Settings</h2>
              <p>Manage employee shift configurations.</p>
              {/* Shift Settings Content */}
            </div>
            <div
              id="role"
              data-section-id="role"
              className={`${styles['settings-section']} ${activeSection === 'role' ? styles.active : ''}`}
            >
              <h2>Role Management</h2>
              <p>Configure user roles and permissions.</p>
              {/* Role Settings Content */}
            </div>
            <div
              id="position"
              data-section-id="position"
              className={`${styles['settings-section']} ${activeSection === 'position' ? styles.active : ''}`}
            >
              <h2>Position Settings</h2>
              <p>Manage employee positions and titles.</p>
              {/* Position Settings Content */}
            </div>
            <div
              id="help"
              data-section-id="help"
              className={`${styles['settings-section']} ${activeSection === 'help' ? styles.active : ''}`}
            >
              <h2>Help & Documentation</h2>
              <p>Find answers to common questions and learn how to use the system.</p>
              {/* Help Content */}
            </div>
          </div>
        </ScrollArea>
      </Grid.Col>
    </Grid>
  );
};

export { SettingContainer };
